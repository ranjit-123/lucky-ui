import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtpbydistributorComponent } from './ntpbydistributor.component';

describe('NtpbydistributorComponent', () => {
  let component: NtpbydistributorComponent;
  let fixture: ComponentFixture<NtpbydistributorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtpbydistributorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtpbydistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
