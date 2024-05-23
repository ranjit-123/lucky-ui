import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtpbyretialerComponent } from './ntpbyretialer.component';

describe('NtpbyretialerComponent', () => {
  let component: NtpbyretialerComponent;
  let fixture: ComponentFixture<NtpbyretialerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtpbyretialerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtpbyretialerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
