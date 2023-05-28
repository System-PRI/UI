import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSupervisorsComponent } from './project-supervisors.component';

describe('ProjectSupervisorsComponent', () => {
  let component: ProjectSupervisorsComponent;
  let fixture: ComponentFixture<ProjectSupervisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSupervisorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSupervisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
