import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Iregister } from '../models/Iregister.js';
import { Ilogin } from '../models/Ilogin.js';
import { IresetPassword } from '../models/Ireset-password.js';
import { Observable } from 'rxjs';
import { Iuser } from '../../../features/models/users/Iuser.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData = signal<Iuser | null>(null);
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
  holdUserData(data: Iuser) {
    this.userData.set(data);
  }
  getUserData(): Iuser | null {
    return this.userData();
  }
  deleteUserData() {
    this.userData.set(null);
    localStorage.removeItem('user');
  }
}
