import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefenseAdditonalDayFormComponent } from './defense-additional-day-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('DefenseAdditionalDayForm', () => {
  let component: DefenseAdditonalDayFormComponent
  let fixture: ComponentFixture<DefenseAdditonalDayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [ DefenseAdditonalDayFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefenseAdditonalDayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
