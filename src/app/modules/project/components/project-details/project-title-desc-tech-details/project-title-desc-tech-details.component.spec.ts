import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTitleDescTechDetailsComponent } from './project-title-desc-tech-details.component';

describe('ProjectTitleDescTechDetailsComponent', () => {
  let component: ProjectTitleDescTechDetailsComponent;
  let fixture: ComponentFixture<ProjectTitleDescTechDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTitleDescTechDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTitleDescTechDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
