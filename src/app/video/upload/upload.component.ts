import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  isDragover = false
  file: File | null = null
  hasUploadedFile = false

  storeFile($event: Event) {
    this.isDragover = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.hasUploadedFile = true
  }

}
