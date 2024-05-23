import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountersaleComponent } from './countersale.component';

describe('CountersaleComponent', () => {
  let component: CountersaleComponent;
  let fixture: ComponentFixture<CountersaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountersaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
