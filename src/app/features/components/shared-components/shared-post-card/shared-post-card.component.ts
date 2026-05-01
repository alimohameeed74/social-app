import {
  Component,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Ipost } from '../../../models/posts/Ipost.js';

@Component({
  selector: 'app-shared-post-card',
  templateUrl: './shared-post-card.component.html',
  styleUrls: ['./shared-post-card.component.css'],
})
export class SharedPostCardComponent implements OnInit, OnDestroy {
  post: InputSignal<Ipost> = input.required();
  private destroy$ = new Subject<void>();
  constructor(private router: Router) {}

  ngOnInit() {}

  goToPostDetails(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
