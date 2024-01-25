import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCriterionSelectComponent } from './radio-criterion-select.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

describe('RadioCriterionSelectComponent', () => {
  let component: RadioCriterionSelectComponent;
  let fixture: ComponentFixture<RadioCriterionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatRadioModule,
        MatIconModule
      ],
      declarations: [ RadioCriterionSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioCriterionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.criteriaGroup = {
      id: '1',
      gradeWeight: '30%',
      selectedCriterion: null,
      name: 'test',
      modificationDate: '11.11.2023',
      criteria: {
        '1': {
          description: 'test',
          isDisqualifying: false,
        }
      }
    },
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
