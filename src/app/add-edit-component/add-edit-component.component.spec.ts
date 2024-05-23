import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditComponentComponent } from './add-edit-component.component';

describe('AddEditComponentComponent', () => {
  let component: AddEditComponentComponent;
  let fixture: ComponentFixture<AddEditComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
