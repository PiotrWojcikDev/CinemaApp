import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';
import { MostViewedMoviesChartComponent } from '../../../components/charts/most-viewed-movies-chart/most-viewed-movies-chart.component';
import { MostViewedGenresChartComponent } from '../../../components/charts/most-viewed-genres-chart/most-viewed-genres-chart.component';
import { MonthlyReservationsSummaryChartComponent } from '../../../components/charts/monthly-reservations-summary-chart/monthly-reservations-summary-chart.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MostViewedMoviesChartComponent,
      MostViewedGenresChartComponent, MonthlyReservationsSummaryChartComponent],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  currentIndex: number = 0;
  carouselWrapper: any;
  prevButton : any;
  nextButton : any;

  

  prevButtonAction() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      // Jeśli jesteśmy na pierwszym elemencie, przejdź do ostatniego
      this.currentIndex = 2; // Zakładając pięć elementów
    }
    this.updateCarousel();
  }

  nextButtonAction() {
    if (this.currentIndex < 2) {
      this.currentIndex++;
    } else {
      // Jeśli jesteśmy na ostatnim elemencie, przejdź do pierwszego
      this.currentIndex = 0;
    }
    this.updateCarousel();
  }

  updateCarousel() {
    this.carouselWrapper = document.querySelector<HTMLElement>(".carousel-wrapper");
    this.prevButton = document.querySelector<HTMLElement>(".carousel-button.prev");
    this.nextButton = document.querySelector<HTMLElement>(".carousel-button.next");
    const translateX = this.currentIndex * -400; // 410px to szerokość elementu plus margines
    this.carouselWrapper!.style.transform = `translateX(${translateX}px)`;
  }
}
