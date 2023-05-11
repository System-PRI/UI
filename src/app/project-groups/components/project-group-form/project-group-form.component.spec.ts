import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGroupFormComponent } from './project-group-form.component';

describe('ProjectGroupFormComponent', () => {
  let component: ProjectGroupFormComponent;
  let fixture: ComponentFixture<ProjectGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectGroupFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
