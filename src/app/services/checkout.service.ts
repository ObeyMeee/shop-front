import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private httpClient: HttpClient) {
  }

  addOrder(purchase: Purchase): Observable<any> {
    const checkoutUrl = `${environment.andromedaApiUrl}/checkout/purchase`;
    return this.httpClient.post<Purchase>(checkoutUrl, purchase);
  }
}
