import { CommonModule } from '@angular/common';
import { Component, Input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-common-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, ProgressSpinnerModule],
  template: `
    <div *ngIf="loading()" style="text-align:center; margin:2rem 0;">
      <p-progressSpinner></p-progressSpinner>
    </div>

    <apx-chart *ngIf="!loading()" 
               [series]="chartOptions().series" 
               [chart]="chartOptions().chart" 
               [xaxis]="chartOptions().xaxis"
               [title]="chartOptions().title">
    </apx-chart>
  `,
})
export class CommonChartComponent implements OnChanges {
  @Input() xData: any[] = [];
  @Input() yData: number[] = [];
  @Input() chartTitle = 'Chart';
  @Input() chartType: 'line' | 'bar' | 'area' = 'line';

  chartOptions = signal<ChartOptions>({
    series: [],
    chart: { type: 'line', height: 350 },
    xaxis: { categories: [] },
    title: { text: '', align: 'center' },
  });

  loading = signal(true);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.xData.length && this.yData.length) {
      this.chartOptions.set({
        series: [{ name: this.chartTitle, data: this.yData }],
        chart: { type: this.chartType, height: 350 },
        xaxis: { categories: this.xData },
        title: { text: this.chartTitle, align: 'center' },
      });
      this.loading.set(false);
    }
  }
}