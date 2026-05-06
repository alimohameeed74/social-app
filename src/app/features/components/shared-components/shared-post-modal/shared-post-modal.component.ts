import { PostsService } from './../../../services/posts/posts.service';
import {
  Component,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { SharedPostCardComponent } from '../shared-post-card/shared-post-card.component';
import { Ipost } from '../../../models/posts/Ipost.js';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { FormsModule } from '@angular/forms';
import { LikeDetailsComponent } from '../../feed-components/like-details/like-details.component';

@Component({
  selector: 'app-shared-post-modal',
  templateUrl: './shared-post-modal.component.html',
  styleUrls: ['./shared-post-modal.component.css'],
  imports: [SharedPostCardComponent, FormsModule],
})
export class SharedPostModalComponent implements OnInit, OnDestroy {
  closeModalEvent = output<boolean>();
  sharePostEvent = output<boolean>();
  post: InputSignal<Ipost> = input.required();
  textBody: string = '';
  body: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  private destory$ = new Subject<void>();
  constructor(
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {}

  closeModal() {
    this.closeModalEvent.emit(false);
  }

  sharePost(id: string) {
    this.body.set(this.textBody);
    let data = {
      body: this.body(),
    };
    this.isLoading.set(true);
    this.postsService
      .sharePost(id, data)
      .pipe(takeUntil(this.destory$))
      .subscribe({
        next: (res: string) => {
          this.isLoading.set(false);
          this.sharePostEvent.emit(true);
          this.sweetAlertService.fireSwal(res, 'success');
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else if (err?.statusCode === 409) {
            this.closeModal();
            this.sweetAlertService.fireSwal(err?.message, 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destory$.next();
  }
}
