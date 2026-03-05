import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";
import { catchError, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../../../services/common.service";
import { DialogService } from "../../../services/dialog.service";
import { CommonTableComponent } from "../../commonComponents/table/table.component";
import { labels } from "../../../utils/json-data";

interface Table {
  id: string;
  name: string;
  createdOn: string;
  fields: { name: string; type: string }[];
  api: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, DialogModule],
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.scss'],
})
export class AnalyticsComponent {
  tables = signal<Table[]>([]);
  showDialog = signal(false);
  tableForm!: FormGroup;
  label = labels

  constructor(private fb: FormBuilder, private http: HttpClient, private common: CommonService, private dialog: DialogService) { }

  ngOnInit() {
    const savedTables = JSON.parse(localStorage.getItem('tables') || '[]');
    this.tables.set(savedTables);
  }

  get fields(): FormArray {
    return this.tableForm.get('fields') as FormArray;
  }

  openTableForm() {
    this.tableForm = this.fb.group({
      tableName: ['', Validators.required],
      apiEndpoint: [''],
      fields: this.fb.array([this.createField()])
    });

    this.showDialog.set(true);
  }

  createField(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  addField() {
    this.fields.push(this.createField());
  }

  submitTable() {
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    const apiUrl = this.tableForm.value.apiEndpoint;
    this.http.get<any[]>(apiUrl)
      .pipe(catchError(err => {
        this.common.error('API Error', 'Unable to fetch data from API');
        return of([]);
      }))
      .subscribe((data: any[]) => {
        if (!data || data.length === 0) {
          this.common.error('Validation Failed', 'API returned no data');
          return;
        }

        const fields = this.tableForm.value.fields;

        const apiKeys = Object.keys(data[0] || {});
        let valid = true;

        for (let f of fields) {
          if (!apiKeys.includes(f.name)) {
            valid = false;
            this.common.error('Field Missing', `Column "${f.name}" is missing in API data`);
          } else {
            const apiType = typeof data[0][f.name];
            if (apiType.toLowerCase() !== f.type.toLowerCase()) {
              valid = false;
              this.common.error('Type Mismatch', `Column "${f.name}" expected type ${f.type} but got ${apiType}`);
            }
          }
        }

        if (valid) {
          const newTable: Table = {
            id: Date.now().toString(),
            name: this.tableForm.value.tableName,
            createdOn: new Date().toLocaleString(),
            fields: fields,
            api: apiUrl
          };

          const updatedTables = [...this.tables(), newTable];
          this.tables.set(updatedTables);
          localStorage.setItem('tables', JSON.stringify(updatedTables));

          this.common.success('Table Added', 'API data matched fields successfully');
          this.closeDialog();
        }
      });
  }

  closeDialog() {
    this.showDialog.set(false);
  }

  openTable(id: string) {
    const table = this.tables().find(t => t.id === id);
    if (!table) return;

    const dialogRef = this.dialog.open({
      title: table!.name,
      component: CommonTableComponent,
      componentData: { data: [], loading: true }
    });

    this.http.get<any[]>(table.api)
      .pipe(catchError((): Observable<any[]> => {
        this.common.error("API Error", 'Unable to load data');
        return of(null as any)
      }))
      .subscribe((data: any[]) => {
        if (!data) {
          dialogRef.close();
          this.common.error('API Error', 'Unable to load table data');
          return;
        }

        if (data.length === 0) {
          dialogRef.close();
          this.common.error('No Data', 'API returned no records');
          return;
        }

        // data.forEach(row => {
        //   row.lat = this.getRandomLat();
        //   row.lng = this.getRandomLng();
        // });

        dialogRef.componentInstance.componentData.set({ data, loading: false })
      })
  }

  getRandomLat(): number {
    return parseFloat((Math.random() * 180 - 90).toFixed(6));
  }

  getRandomLng(): number {
    return parseFloat((Math.random() * 360 - 180).toFixed(6));
  }

  trackById(index: number, item: Table) {
    return item.id;
  }
}