import { Component, Input, OnInit } from '@angular/core';
import { IaccountUser } from '../../../models/account-user/Iaccount-user.js';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit {
  @Input() accoutUser: IaccountUser | null = null;
  @Input() postsNum: number | null = null;
  constructor() {}

  ngOnInit() {}
}
