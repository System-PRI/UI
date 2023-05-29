import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectShellComponent } from './project-shell.component';

describe('ProjectShellComponent', () => {
  let component: ProjectShellComponent;
  let fixture: ComponentFixture<ProjectShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectShellComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
