import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptAddPointComponent } from './accept-add-point.component';

describe('AcceptAddPointComponent', () => {
  let component: AcceptAddPointComponent;
  let fixture: ComponentFixture<AcceptAddPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptAddPointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptAddPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
