import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEvaluationCardsComponent } from './project-evaluation-cards.component';

describe('ProjectEvaluationCardsComponent', () => {
  let component: ProjectEvaluationCardsComponent;
  let fixture: ComponentFixture<ProjectEvaluationCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEvaluationCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEvaluationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
