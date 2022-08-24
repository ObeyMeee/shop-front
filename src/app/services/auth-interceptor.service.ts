import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, lastValueFrom, Observable} from "rxjs";
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private oktaAuthStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    const securedEndpoints = [`${environment.andromedaApiUrl}/orders`]

    if(securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      const accessToken = this.oktaAuth.getAccessToken();
      req = req.clone({
        setHeaders:{
          Authorization: 'Bearer ' + accessToken
        }
      })
    }
    return await lastValueFrom(next.handle(req));
  }
}
