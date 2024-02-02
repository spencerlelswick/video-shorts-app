import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { OnDestroy, OnInit, Input, OnChanges } from '@angular/core';
import IClip from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit, OnDestroy {

  showAlert = false
  alertMsg = 'Please wait! Updating clip.'
  alertColor = 'blue'
  inSubmission = false

  @Input() activeClip: IClip | null = null

  clipID = new FormControl('', { nonNullable: true })

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })


  constructor(private modal: ModalService, private clipsService: ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges(): void {
    if (!this.activeClip) {
      return
    }

    this.clipID.setValue(this.activeClip.title)
    this.clipID.setValue(this.activeClip.docID as string)

  }

  async submit() {
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.'

    try {
      await this.clipsService.updateClip(this.clipID.value, this.title.value)
    } catch (error) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong! Try again later.'
      return
    }

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'
  }



}
