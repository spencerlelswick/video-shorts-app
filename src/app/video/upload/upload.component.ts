import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid'
import { last, switchMap } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {


  isDragover = false
  file: File | null = null
  hasUploadedFile = false
  showAlert = false
  alertMsg = 'Please wait while your clip is being uploaded.'
  alertColor = 'blue'
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null

  constructor(private storage: AngularFireStorage, private auth: AngularFireAuth, private clipsService: ClipService) {
    auth.user.subscribe(user => this.user = user)
  }

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  uploadForm = new FormGroup({
    title: this.title
  })

  storeFile($event: Event) {
    this.isDragover = false
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null

    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.hasUploadedFile = true
  }

  uploadFile() {
    this.uploadForm.disable()
    this.showAlert = true;
    this.alertMsg = 'Please wait while your clip is being uploaded.'
    this.alertColor = 'blue'
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    const task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    task.percentageChanges().subscribe(progress => { this.percentage = progress as number / 100 })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: url
        }

        this.clipsService.createClip(clip)
        console.log(clip);

        this.alertMsg = 'Success! Your clip has been uploaded'
        this.alertColor = 'green'
        this.showPercentage = false
      },
      error: (error) => {
        this.uploadForm.enable()
        this.alertMsg = 'Upload failed, please try again later.'
        this.alertColor = 'red'
        this.showPercentage = false
        this.inSubmission = true
        console.error(error)
      }
    });
  }

}
