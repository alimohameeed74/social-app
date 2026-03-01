import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbit/flowbit.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit {
  toggler: boolean;
  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
  ) {
    this.toggler = false;
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  toggle() {
    this.toggler = !this.toggler;
  }
  goTo(link: string = '/') {
    if (link === '/') {
      localStorage.removeItem('token');
    }
    this.router.navigate([link]);
  }
}
