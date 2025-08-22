import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptAddEventsComponent } from './accept-add-events.component';

describe('AcceptAddEventsComponent', () => {
  let component: AcceptAddEventsComponent;
  let fixture: ComponentFixture<AcceptAddEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptAddEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptAddEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
