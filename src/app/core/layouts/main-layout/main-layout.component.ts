import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { AuthService } from '../../auth/services/auth.service.js';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  imports: [RouterOutlet, NavbarComponent],
})
export class MainLayoutComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
