import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Country} from "../common/country";
import {HttpClient} from "@angular/common/http";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl: string = 'http://localhost:8080/api'

  constructor(private httpClient: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    const countriesUrl = `${this.baseUrl}/countries`;
    return this.httpClient.get<GetResponseCountries>(countriesUrl)
      .pipe(map(response => response._embedded.countries))
  }

  getStatesByCountryCode(code: string): Observable<State[]> {
    const searchUrl = `${this.baseUrl}/states/search/findByCountryCode?code=${code}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(map(response => response._embedded.states))
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
