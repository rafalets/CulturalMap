import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAdminComponent } from './status-admin.component';

describe('StatusAdminComponent', () => {
  let component: StatusAdminComponent;
  let fixture: ComponentFixture<StatusAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
