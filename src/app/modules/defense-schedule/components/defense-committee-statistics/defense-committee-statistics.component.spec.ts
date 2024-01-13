import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseCommitteeStatisticsComponent } from './defense-committee-statistics.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DefenseCommitteeStatisticsComponent', () => {
  let component: DefenseCommitteeStatisticsComponent;
  let fixture: ComponentFixture<DefenseCommitteeStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [ DefenseCommitteeStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefenseCommitteeStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
