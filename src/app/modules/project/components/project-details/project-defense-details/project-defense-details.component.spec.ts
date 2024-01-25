import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDefenseDetailsComponent } from './project-defense-details.component';

describe('ProjectDefenseDetailsComponent', () => {
  let component: ProjectDefenseDetailsComponent;
  let fixture: ComponentFixture<ProjectDefenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDefenseDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDefenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
