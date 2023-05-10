import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGroupsListComponent } from './project-groups-list.component';

describe('ProjectGroupsListComponent', () => {
  let component: ProjectGroupsListComponent;
  let fixture: ComponentFixture<ProjectGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectGroupsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
