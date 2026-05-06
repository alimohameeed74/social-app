import { Component, effect, input, InputSignal, OnInit, output } from '@angular/core';
import { LikeDetailsComponent } from '../like-details/like-details.component';
import { Ipost } from '../../../models/posts/Ipost.js';

@Component({
  selector: 'app-likes-modal',
  templateUrl: './likes-modal.component.html',
  styleUrls: ['./likes-modal.component.css'],
  imports: [LikeDetailsComponent],
})
export class LikesModalComponent implements OnInit {
  closeModalEvent = output<boolean>();
  postId: InputSignal<string> = input.required();

  constructor() {}

  ngOnInit() {}
  closeModal() {
    this.closeModalEvent.emit(false);
  }
}
