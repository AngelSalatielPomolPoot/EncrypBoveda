import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraseniasComponent } from './contrasenias.component';

describe('ContraseniasComponent', () => {
  let component: ContraseniasComponent;
  let fixture: ComponentFixture<ContraseniasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContraseniasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraseniasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
