import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatisticService } from '../../../services/statistic.service';

Chart.register(...registerables);

@Component({
  selector: 'app-most-viewed-movies-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-viewed-movies-chart.component.html',
  styleUrls: ['./most-viewed-movies-chart.component.css'],
  providers: [StatisticService]
})
export class MostViewedMoviesChartComponent {

  showInfo: boolean = false;
  top5Movies: Array<any> = [];
  globalMinDate: any;
  globalMaxDate: any;
  customColors: Array<string> = [
    '#009c1a',
    '#22b600',
    '#26cc00',
    '#7be382',
    '#d2f2d4',
  ];

  constructor(private statisticService: StatisticService) { }

  ngOnInit() {
    this.getMostViewedMovies();
  }

  generateChart() {
    new Chart("barChart", {
      type: 'bar',
      data: {
        labels: this.top5Movies.map( movie => movie.title),
        datasets: [{
          label: 'Liczba rezerwacji',
          data: this.top5Movies.map( movie => movie.count),
          backgroundColor: this.customColors,
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

  getMostViewedMovies() {
    this.statisticService.getMostViewedMovies()
    .subscribe({
      next: (res) => {
        this.top5Movies = res.data.top5Movies;
        this.globalMinDate = res.data.globalMinDate;
        this.globalMaxDate = res.data.globalMaxDate;
        this.generateChart();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
  
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  }
}
