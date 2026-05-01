/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LikeCardSkeltonComponent } from './like-card-skelton.component';

describe('LikeCardSkeltonComponent', () => {
  let component: LikeCardSkeltonComponent;
  let fixture: ComponentFixture<LikeCardSkeltonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeCardSkeltonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeCardSkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
