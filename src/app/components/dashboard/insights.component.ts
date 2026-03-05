import { Component, signal, OnInit } from '@angular/core';
import { CommonChartComponent } from '../commonComponents/chart.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { labels } from '../../utils/json-data';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonChartComponent, ProgressSpinnerModule],
  template: `
    <h3>{{label.Insight.header}}</h3>
    <app-common-chart 
      [xData]="categories()" 
      [yData]="values()" 
      [chartTitle]="'Monthly Sales'"
      [chartType]="'line'">
    </app-common-chart>
  `,
})
export class InsightsComponent implements OnInit {
  categories = signal<string[]>([]);
  values = signal<number[]>([]);
  label = labels

  ngOnInit() {
    setTimeout(() => {
      this.categories.set(['Jan', 'Feb', 'Mar', 'Apr', 'May']);
      this.values.set([30, 40, 35, 50, 49]);
    }, 300);
  }
}