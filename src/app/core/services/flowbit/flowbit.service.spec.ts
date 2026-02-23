/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FlowbitService } from './flowbit.service';

describe('Service: Flowbit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlowbitService]
    });
  });

  it('should ...', inject([FlowbitService], (service: FlowbitService) => {
    expect(service).toBeTruthy();
  }));
});
