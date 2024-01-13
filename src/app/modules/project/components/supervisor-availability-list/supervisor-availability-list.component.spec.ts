import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorAvailabilityListComponent } from './supervisor-availability-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SupervisorAvailabilityListComponent', () => {
  let component: SupervisorAvailabilityListComponent;
  let fixture: ComponentFixture<SupervisorAvailabilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        HttpClientTestingModule
      ],
      declarations: [ SupervisorAvailabilityListComponent ],
      providers: [provideMockStore({})],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorAvailabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
