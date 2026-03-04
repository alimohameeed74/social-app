import { Component, Input, OnInit } from '@angular/core';
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
  name: string = '';
  toggler: boolean;
  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
  ) {
    this.name = '';
    this.toggler = false;
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    const name = localStorage.getItem('name');
    if (name) {
      this.name = name;
    }
  }
  toggle() {
    this.toggler = !this.toggler;
  }
  goTo(link: string = '/') {
    if (link === '/') {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
    }
    this.router.navigate([link]);
  }
}
