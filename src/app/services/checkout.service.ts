import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private httpClient: HttpClient) {
  }

  addOrder(purchase: Purchase): Observable<any> {
    const checkoutUrl = 'http://localhost:8080/api/checkout/purchase';
    return this.httpClient.post<Purchase>(checkoutUrl, purchase);
  }
}
