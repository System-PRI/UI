import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefenseDateRangeSelectionComponent } from './defense-date-range-selection.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('DefenseDateRangeSelectionComponent', () => {
  let component: DefenseDateRangeSelectionComponent;
  let fixture: ComponentFixture<DefenseDateRangeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      declarations: [ DefenseDateRangeSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefenseDateRangeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
