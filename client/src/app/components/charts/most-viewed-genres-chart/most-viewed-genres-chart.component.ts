import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { StatisticService } from '../../../services/statistic.service';

Chart.register(...registerables);

@Component({
  selector: 'app-most-viewed-genres-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-viewed-genres-chart.component.html',
  styleUrls: ['./most-viewed-genres-chart.component.css'],
  providers: [StatisticService]
})
export class MostViewedGenresChartComponent {
  
  showInfo: boolean = false;
  globalMinDate: any;
  globalMaxDate: any;
  mostViewedGenres: Array<any> = [];
  customColors: Array<string> = [
    '#016612',
    '#009c1a',
    '#22b600',
    '#26cc00',
    '#7be382',
    '#aaf8b8', 
    '#d2f2d4',
  ];

  constructor(private statisticService: StatisticService) { }


  ngOnInit() {
    this.getMostViewedGenres();

  }

  generateChart() {
    new Chart("pieChart", {
      type: 'pie',
      data: {
        labels: this.mostViewedGenres.map((genre) => genre.genre ),
        datasets: [{
          label: '# of Votes',
          data: this.mostViewedGenres.map((genre) => genre.count),
          backgroundColor: this.customColors,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            display: false, // Wyłącz wyświetlanie osi X
          },
          y: {
            display: false, // Wyłącz wyświetlanie osi Y
          }
        },
        plugins: {
          tooltip: {
            enabled: false
          },
          datalabels: {
            color: 'black',
            formatter: (value, context) => {
              const datapoints = context.chart.data.datasets[0].data;
              function totalSum(total: any, datapoint: any) {
                return total + datapoint;
              }
              const totalValue = datapoints.reduce(totalSum, 0);
              const percentageValue = (value / totalValue * 100).toFixed(1);
              return `${percentageValue}%`;
            },
            font: {
              size: 16, 
              weight: 'bold',
            },
          }
          ,
        legend: {
          position: 'bottom' // Ustaw legendę na dole wykresu
        }
        }
      },
      
      plugins: [ChartDataLabels]
    });
  }

  getMostViewedGenres() {
    this.statisticService.getMostViewedGenres()
    .subscribe({
      next: (res) => {
        this.mostViewedGenres = res.data.genreCounts;
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
