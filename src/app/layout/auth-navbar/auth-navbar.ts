import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-navbar',
  imports: [RouterLink,RouterModule],
  templateUrl: './auth-navbar.html',
  styleUrl: './auth-navbar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthNavbar {

}
