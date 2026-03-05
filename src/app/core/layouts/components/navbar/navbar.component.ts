import { Component, Input, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbit/flowbit.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service.js';
import { Iuser } from '../../../../features/models/users/Iuser.js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit {
  userDetails: Iuser | null = null;
  toggler: boolean;
  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.userDetails = null;
    this.toggler = false;
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.userDetails = this.authService.getUserData();
  }
  toggle() {
    this.toggler = !this.toggler;
  }
  goTo(link: string = '/') {
    if (link === '/') {
      localStorage.removeItem('token');
      this.authService.deleteUserData();
    }
    this.router.navigate([link]);
  }
}
