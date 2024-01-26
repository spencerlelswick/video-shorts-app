import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private auth: AngularFireAuth) { }

  credentials = {
    email: '',
    password: ''
  }
  showAlert = false;
  alertMsg = ''
  alertColor = ''
  inSubmission = false

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! You are being logged in...'
    this.alertColor = 'blue'
    this.inSubmission = true
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (error) {
      this.inSubmission = false
      this.alertMsg = 'An unexpected error occured. Please try again later'
      this.alertColor = 'red'

      console.error(error);

      return
    }
    this.alertMsg = 'Success! You are now logged in.'
    this.alertColor = 'green'
  }

}
