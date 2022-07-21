import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExpirationDateService {


  getCreditCardExpirationMonth(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardExpirationYear(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let i = startYear; i <= endYear; i++) {
      data.push(i)
    }
    return of(data);
  }
}
