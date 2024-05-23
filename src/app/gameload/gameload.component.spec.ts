import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameloadComponent } from './gameload.component';

describe('GameloadComponent', () => {
  let component: GameloadComponent;
  let fixture: ComponentFixture<GameloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
