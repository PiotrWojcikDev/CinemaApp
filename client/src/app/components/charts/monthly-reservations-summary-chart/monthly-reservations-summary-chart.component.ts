import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatisticService } from '../../../services/statistic.service';
Chart.register(...registerables);

@Component({
  selector: 'app-monthly-reservations-summary-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-reservations-summary-chart.component.html',
  styleUrls: ['./monthly-reservations-summary-chart.component.css'],
  providers: [StatisticService]
})
export class MonthlyReservationsSummaryChartComponent {

  showInfo: boolean = false;
  globalMinDate: any;
  globalMaxDate: any;
  numbersOfReservationsByMonths: Array<any> = [];

  constructor(private statisticService: StatisticService) { }

  ngOnInit() {
    this.getMonthlyReserervationsSummary();
    
  }

  generateChart() {
    new Chart("lineChart", {
      type: 'line',
      data: {
        labels: this.numbersOfReservationsByMonths.map((item) => item.month),
        datasets: [{
          label: 'Liczba rezerwacji',
          data: this.numbersOfReservationsByMonths.map((item) => item.count),
          backgroundColor: '#32a852',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false, 
          }
        }
      }
    });
  }

  getMonthlyReserervationsSummary() {
    this.statisticService.getMonthlyReserervationsSummary()
    .subscribe({
      next: (res) => {
        this.numbersOfReservationsByMonths = res.data;
        console.log(this.numbersOfReservationsByMonths);
        this.generateChart();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

}
