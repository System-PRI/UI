import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectGradeComponent } from './project-grade.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('ProjectGradeComponent', () => {
  let component: ProjectGradeComponent;
  let fixture: ComponentFixture<ProjectGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [ ProjectGradeComponent ],
      providers: [provideMockStore({})],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
