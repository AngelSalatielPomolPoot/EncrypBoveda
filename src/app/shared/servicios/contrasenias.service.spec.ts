import { TestBed } from '@angular/core/testing';

import { ContraseniasService } from './contrasenias.service';

describe('ContraseniasService', () => {
  let service: ContraseniasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContraseniasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
