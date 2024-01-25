import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersTableComponent } from './project-members-table.component';

describe('ProjectMembersTableComponent', () => {
  let component: ProjectMembersTableComponent;
  let fixture: ComponentFixture<ProjectMembersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMembersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
