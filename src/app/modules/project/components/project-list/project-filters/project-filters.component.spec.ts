import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFiltersComponent } from './project-filters.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

describe('ProjectFiltersComponent', () => {
  let component: ProjectFiltersComponent;
  let fixture: ComponentFixture<ProjectFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule
      ],
      declarations: [ ProjectFiltersComponent ],
      providers: [provideMockStore({})],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
