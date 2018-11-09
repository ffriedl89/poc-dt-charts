import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DtTimeseriesChartComponent } from './timeseries-chart/timeseries-chart.component';

const routes: Routes = [
  { path: '', component: DtTimeseriesChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
