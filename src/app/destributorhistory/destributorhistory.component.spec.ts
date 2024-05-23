import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestributorhistoryComponent } from './destributorhistory.component';

describe('DestributorhistoryComponent', () => {
  let component: DestributorhistoryComponent;
  let fixture: ComponentFixture<DestributorhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestributorhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestributorhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
