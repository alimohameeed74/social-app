import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  constructor(
    private loc: Location,
    private router: Router,
  ) {}

  ngOnInit() {}
  back() {
    this.loc.back();
  }
  goToFeed() {
    this.router.navigate(['/main']);
  }
}
