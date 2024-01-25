import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActionButtonsComponent } from './project-action-buttons.component';

describe('ProjectActionButtonsComponent', () => {
  let component: ProjectActionButtonsComponent;
  let fixture: ComponentFixture<ProjectActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectActionButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
