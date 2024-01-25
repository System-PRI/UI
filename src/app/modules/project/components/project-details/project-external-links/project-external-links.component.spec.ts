import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExternalLinksComponent } from './project-external-links.component';

describe('ProjectExternalLinksComponent', () => {
  let component: ProjectExternalLinksComponent;
  let fixture: ComponentFixture<ProjectExternalLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectExternalLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectExternalLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
