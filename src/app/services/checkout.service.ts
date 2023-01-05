import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {PaymentInfo} from "../common/payment-info";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl: string = environment.andromedaApiUrl;

  constructor(private httpClient: HttpClient) {
  }

  addOrder(purchase: Purchase): Observable<any> {
    const checkoutUrl = `${this.baseUrl}/checkout/purchase`;
    return this.httpClient.post<Purchase>(checkoutUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any>{
    const paymentIntentUrl = `${this.baseUrl}/checkout/payment-intent`;
    return this.httpClient.post<PaymentInfo>(paymentIntentUrl, paymentInfo)
  }
}
