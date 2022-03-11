import { TestBed } from '@angular/core/testing';

import { UserGuard2Guard } from './user-guard2.guard';

describe('UserGuard2Guard', () => {
  let guard: UserGuard2Guard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserGuard2Guard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
