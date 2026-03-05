import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { MapComponent } from '../map.component';
import { CommonService } from '../../../services/common.service';
import { DialogService } from '../../../services/dialog.service';

interface CellDisplay {
  isObject: boolean;
  preview: string; 
  tooltip: string; 
}

interface DisplayRow {
  _raw: any;
  cells: Record<string, CellDisplay>;
}

@Component({
  selector: 'app-common-table',
  standalone: true,
  imports: [CommonModule, TableModule, SkeletonModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class CommonTableComponent implements OnChanges {

  constructor(private common: CommonService, private dialog: DialogService) {}

  @Input() data: any[] = [];
  @Input() loading = false;

  columns: string[] = [];
  displayRows: DisplayRow[] = [];

  skeletonCols = Array(6).fill(0);
  skeletonRows = Array(5).fill(0);
  readonly skeletonWidths: string[] = Array.from({ length: 30 }, () => {
    const widths = ['60%', '70%', '80%', '90%', '100%'];
    return widths[Math.floor(Math.random() * widths.length)];
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data']) return;

    if (this.data?.length) {
      this.columns = Object.keys(this.data[0]);
      this.displayRows = this.data.map(row => ({
        _raw: row,
        cells: Object.fromEntries(
          this.columns.map(col => [col, this.buildCell(row[col])])
        ),
      }));
    } else {
      this.columns = [];
      this.displayRows = [];
    }
        console.log('this.data', this.data);
        console.log('this.columns', this.columns);
        console.log('this.displayRows', this.displayRows);
  }

  private buildCell(value: any): CellDisplay {
    if (value !== null && typeof value === 'object') {
      const keys = Object.keys(value);
      const preview = keys.slice(0, 2)
        .map(k => `${k}: ${value[k] !== null && typeof value[k] === 'object' ? '{…}' : String(value[k])}`)
        .join(', ');
      return {
        isObject: true,
        preview: `{ ${preview}${keys.length > 2 ? ', …' : ''} }`,
        tooltip: JSON.stringify(value, null, 2),
      };
    }
    return { isObject: false, preview: String(value ?? ''), tooltip: '' };
  }

  viewLocation(row: any) {
    const lat = Number(row.address?.geo?.lat);
    const lng = Number(row.address?.geo?.lng);

    if (!lat || !lng) {
      this.common.error('Location not found!');
      return;
    }

    this.dialog.open({
      title: 'Location',
      component: MapComponent,
      componentData: { lat, lng },
    });
  }
}