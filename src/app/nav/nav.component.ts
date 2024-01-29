import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  public isAuthenticated = false

  constructor(public modal: ModalService, public auth: AuthService, private afAuth: AngularFireAuth, private router: Router) {
    this.auth.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status
    })
  }

  openModal($event: Event) {
    $event.preventDefault()
    this.modal.toggleModal('auth')
  }

  async logout($event: Event) {
    $event.preventDefault
    await this.afAuth.signOut()
    await this.router.navigateByUrl('/')
  }
}
