import { Component } from '@angular/core';
import { DtSeries, DtOptions } from './timeseries-chart/timeseries-chart.component';


export function generateData(
  startDate: number,
  endDate: number,
  nrOfDataPoints: number,
  minValue: number,
  maxValue: number
): Array<[number, number]> {
  const arr = [];
  const tick = (endDate - startDate) / nrOfDataPoints;
  for (let i = 0; i < nrOfDataPoints; i++) {
    arr[i] = [startDate + tick * i, randomizeValue(minValue, maxValue)];
  }
  return arr;
}

export function randomizeValue(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'poc-dt-charts';

  series: DtSeries[] = [
    {
      name: 'Requests',
      data: generateData(Date.now(), Date.now() + 2 * 60 * 60 * 1000, 80, 0, 3000),
    },
  ];

  options: DtOptions = {
    xAxis: {
      ticks: 10,
    },
    yAxis: {
      ticks: 6,
    },
  };

}

