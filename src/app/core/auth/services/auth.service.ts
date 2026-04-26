import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Iregister } from '../models/Iregister.js';
import { Ilogin } from '../models/Ilogin.js';
import { IresetPassword } from '../models/Ireset-password.js';
import { map, Observable } from 'rxjs';
import { Iuser } from '../../../features/models/users/Iuser.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: WritableSignal<Iuser | null> = signal(null);
  private isUserLogged: WritableSignal<boolean> = signal(false);
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}
  login(data: Ilogin): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/users/signin`, data);
  }
  register(data: Iregister): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/users/signup`, data);
  }
  resetPassword(data: IresetPassword): Observable<any> {
    return this.httpClient.patch(`${environment.apiURL}/users/change-password`, data);
  }

  holdUserData(data: Iuser) {
    this.userData.set(data);
  }
  getUserData(): Iuser | null {
    return this.userData();
  }
  deleteUserData() {
    this.userData.set(null);
    localStorage.removeItem('userData');
  }

  isUserLoggedIn() {
    return this.isUserLogged();
  }

  userLogout() {
    this.isUserLogged.set(false);
    localStorage.removeItem('token');
  }

  userLogin() {
    this.isUserLogged.set(true);
  }

  init() {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.isTokenExpired(token)) {
        this.deleteUserData();
        this.userLogout();
        this.router.navigate(['/']);
      } else {
        this.userLogin();
        const userData = localStorage.getItem('userData');
        if (userData) {
          this.holdUserData(JSON.parse(userData));
        }
      }
    } else {
      this.deleteUserData();
      this.userLogout();
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // if true => token expired
  }
}
