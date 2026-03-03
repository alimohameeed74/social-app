import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iregister } from '../models/Iregister.js';
import { Ilogin } from '../models/Ilogin.js';
import { IresetPassword } from '../models/Ireset-password.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  login(data: Ilogin): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/users/signin`, data);
  }
  register(data: Iregister): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/users/signup`, data);
  }
  resetPassword(data: IresetPassword): Observable<any> {
    return this.httpClient.patch(`${environment.apiURL}/users/change-password`, data, {
      headers: environment.headers,
    });
  }
}
