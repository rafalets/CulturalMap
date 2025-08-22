import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAcceptCanselComponent } from './popup-accept-cansel.component';

describe('PopupAcceptCanselComponent', () => {
  let component: PopupAcceptCanselComponent;
  let fixture: ComponentFixture<PopupAcceptCanselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupAcceptCanselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAcceptCanselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
