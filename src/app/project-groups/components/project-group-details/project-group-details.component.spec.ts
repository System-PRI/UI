import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGroupDetailsComponent } from './project-group-details.component';

describe('ProjectGroupDetailsComponent', () => {
  let component: ProjectGroupDetailsComponent;
  let fixture: ComponentFixture<ProjectGroupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectGroupDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
