import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean;
  userFullName: string;

  constructor(private oktaAuthStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
  }

  ngOnInit(): void {
    this.oktaAuthStateService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    )
  }

  logout() {
    this.oktaAuth.signOut();
  }

  private getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(result => this.userFullName = result.name);
    }
  }
}
