import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import OktaSignIn from "@okta/okta-signin-widget";

import myAppConfig from "../../config/my-app-config";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(private oktaAuthStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
        logo: "assets/images/logo.png",
        baseUrl: myAppConfig.oidc.issuer.split("oauth2")[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUri: myAppConfig.oidc.redirectUri,
        authParams: {
          pkce: true,
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes,
        }

      }
    )
  }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl({
        el: '#okta-sign-in-widget' // this name should be same as div tag id in login.component.html
      },
      (response) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      }, (error) => {
        throw error;
      }
    );
  }


}
