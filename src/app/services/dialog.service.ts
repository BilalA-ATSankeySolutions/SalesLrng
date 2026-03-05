import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonDialogComponent, CommonDialogData } from '../components/commonComponents/dialog/dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {

  constructor(private dialog: MatDialog) {}

  open<T>(config: {
    title: string;
    component: Type<T>;
    componentData?: Partial<T>; 
    width?: string;
  }): MatDialogRef<CommonDialogComponent> {
    return this.dialog.open(CommonDialogComponent, {
      width: config.width ?? '80vw',
      maxWidth: '1200px',
      data: {
        title: config.title,
        component: config.component,
        componentData: config.componentData ?? {}
      } as CommonDialogData
    });
  }
}