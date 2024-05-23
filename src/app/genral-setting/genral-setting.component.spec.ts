import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenralSettingComponent } from './genral-setting.component';

describe('GenralSettingComponent', () => {
  let component: GenralSettingComponent;
  let fixture: ComponentFixture<GenralSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenralSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenralSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
