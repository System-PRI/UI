import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorAvailabilityFormComponent } from './supervisor-availability-form.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

describe('SupervisorAvailabilityFormComponent', () => {
  let component: SupervisorAvailabilityFormComponent;
  let fixture: ComponentFixture<SupervisorAvailabilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        MatSnackBarModule,
        MatIconModule,
        ReactiveFormsModule,
      ],
      declarations: [ SupervisorAvailabilityFormComponent ],
      providers: [provideMockStore({})],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorAvailabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
