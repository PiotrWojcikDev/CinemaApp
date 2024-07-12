import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationsComponent } from './reservations.component';
import { ReservationService } from '../../../services/reservation.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ReservationsComponent', () => {
  let component: ReservationsComponent;
  let fixture: ComponentFixture<ReservationsComponent>;
  let reservationService: ReservationService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientModule, ReservationsComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: ReservationService }],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsComponent);
    component = fixture.componentInstance;
    reservationService = TestBed.inject(ReservationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reservations from the service', async () => {
    const getAllReservationsSpy = jest.spyOn(reservationService, 'getAllReservations');

    await fixture.whenStable(); // Czekaj na zakończenie wszystkich asynchronicznych operacji
    fixture.detectChanges();
    console.log('Component initialized:', component);

    console.log('Number of calls:', getAllReservationsSpy.mock.calls.length);

    expect(getAllReservationsSpy).toHaveBeenCalled();
    expect(component.allReservations.length).toBeGreaterThan(0);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  afterAll(() => {
    // Jeśli używasz Angular TestBed, zakończ wszystkie rzeczy związane z TestBed po zakończeniu testu
    TestBed.resetTestingModule();
  });
  // Add more tests as needed
});
