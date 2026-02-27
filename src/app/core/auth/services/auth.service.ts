import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iregister } from '../models/Iregister.js';
import { environment } from '../../../../environments/environment.js';
import { Observable } from 'rxjs';
import { Ilogin } from '../models/Ilogin.js';
import { IresetPassword } from '../models/Ireset-password.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  login(data: Ilogin) {
    return this.httpClient.post(`${environment.apiURL}/users/signin`, data);
  }
  register(data: Iregister) {
    return this.httpClient.post(`${environment.apiURL}/users/signup`, data);
  }
  resetPassword(data: IresetPassword) {
    return this.httpClient.patch(`${environment.apiURL}/users/change-password`, data);
  }
}
