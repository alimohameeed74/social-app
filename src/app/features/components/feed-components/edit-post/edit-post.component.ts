import { SweetAlertService } from './../../../../core/services/sweet-alert/sweet-alert.service';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../services/posts/posts.service.js';
import { ActivatedRoute } from '@angular/router';
import { Ipost } from '../../../models/posts/Ipost.js';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
  imports: [FormsModule, LoaderComponent, ReactiveFormsModule],
})
export class EditPostComponent implements OnInit {
  post = signal<Ipost | null>(null);
  isloading: WritableSignal<boolean> = signal(false);
  postBody: string;
  postForm: FormGroup;
  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.postBody = '';
    this.postForm = this.fb.group(
      {
        body: [''],
      },
      {
        validators: [this.checkBody],
      },
    );
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getPostDetails(id);
      }
    });
  }

  getPostDetails(id: string) {
    this.isloading.set(true);

    this.postsService.getPostDetails(id).subscribe({
      next: (res: any) => {
        this.isloading.set(false);

        this.post.set(res?.data?.post);
        this.postBody = res?.data?.post?.body ? res?.data?.post?.body : 'No body';
      },
      error: (err) => {
        this.isloading.set(false);
        console.log(err);
      },
    });
  }
  updatePost(postId: string) {
    this.isloading.set(true);
    this.postsService.updatePost(postId, this.createFormData()).subscribe({
      next: (res) => {
        this.isloading.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.router.navigate(['/main/profile']);
      },
      error: (err) => {
        this.isloading.set(false);
      },
    });
  }
  checkBody(form: AbstractControl) {
    const body = form.get('body');

    if (body?.value.length < 2) {
      body?.setErrors({
        errLength: true,
      });
      return {
        bodyLength: true,
      };
    }
    return null;
  }
  createFormData() {
    const formData = new FormData();
    if (this.postForm.get('body')?.value) {
      formData.append('body', this.postForm.get('body')?.value);
    }

    return formData;
  }
  get getPostBodyController() {
    return this.postForm.get('body');
  }
  goTo() {
    this.router.navigate(['/main/profile']);
  }
}
