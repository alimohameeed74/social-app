/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FeedRightComponent } from './feed-right.component';

describe('FeedRightComponent', () => {
  let component: FeedRightComponent;
  let fixture: ComponentFixture<FeedRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
