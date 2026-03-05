import { Component, Inject, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NgComponentOutlet } from '@angular/common';

export interface CommonDialogData {
  title: string;
  component: Type<any>;
  componentData?: any;
  width?: string;
}

@Component({
  selector: 'app-common-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, NgComponentOutlet],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class CommonDialogComponent {
  title: string;
  component: Type<any>;
  componentData = signal<any>({});

  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommonDialogData
  ) {
    this.title = data.title;
    this.component = data.component;
    this.componentData.set(data.componentData ?? {});
  }
}