import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefenseScheduleComponent } from './defense-schedule.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('DefenseScheduleComponent', () => {
  let component: DefenseScheduleComponent;
  let fixture: ComponentFixture<DefenseScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      declarations: [ DefenseScheduleComponent ],
      providers: [provideMockStore({})],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefenseScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
