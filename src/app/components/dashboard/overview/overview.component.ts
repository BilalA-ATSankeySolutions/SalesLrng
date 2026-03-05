import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';
import { UsersService } from '../../../services/users.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {labels} from '../../../utils/json-data'

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, CardModule, ProgressSpinnerModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  users = signal<any[]>([]);
  loading = signal<boolean>(true);
  fetchError = signal<string | null>(null);
  exportLoading = signal<boolean>(false);
  pdfLoading = signal<boolean>(false);
  label = labels;

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.usersService.loading$.subscribe(isLoading => this.loading.set(isLoading));
    this.usersService.exportLoading$.subscribe(isLoading => this.exportLoading.set(isLoading));

    this.usersService
      .fetchUsers()
      .pipe(
        tap(users => {
          this.users.set(users ?? []);
          this.fetchError.set(null);
        }),
        catchError(err => {
          this.users.set([]);
          this.fetchError.set('Could not load users. Please try again later.');
          this.loading.set(false);
          return of([]);
        }),
      )
      .subscribe();
  }

  async onExportExcel() {
    this.usersService.exportData().subscribe({
      next: async ({ users, posts, errors }) => {

        const workbook = new ExcelJS.Workbook();
        let sheetsAdded = 0;

        // USERS SHEET
        if (users) {

          const sheet = workbook.addWorksheet('Users');

          sheet.columns = [
            { header: 'ID', key: 'id', width: 6 },
            { header: 'Name', key: 'name', width: 22 },
            { header: 'Username', key: 'username', width: 16 },
            { header: 'Email', key: 'email', width: 28 },
            { header: 'Phone', key: 'phone', width: 18 },
            { header: 'Website', key: 'website', width: 18 },
            { header: 'Company', key: 'company', width: 22 },
            { header: 'City', key: 'city', width: 16 },
          ];

          users.forEach(u => {
            sheet.addRow({
              id: u.id,
              name: u.name,
              username: u.username,
              email: u.email,
              phone: u.phone,
              website: u.website,
              company: u.company?.name ?? '',
              city: u.address?.city ?? '',
            });
          });

          sheet.getColumn(4).eachCell(cell => {
            cell.protection = { locked: false };
          });

          sheet.columns.forEach((col, index) => {
            if (index !== 3 && col?.eachCell) {
              col.eachCell(cell => {
                cell.protection = { locked: true };
              });
            }
          });

          await sheet.protect('password', {
            selectLockedCells: true,
            selectUnlockedCells: true
          });

          sheetsAdded++;
        }

        if (posts) {

          const sheet = workbook.addWorksheet('Posts');

          sheet.columns = [
            { header: 'ID', key: 'id', width: 6 },
            { header: 'User ID', key: 'userId', width: 10 },
            { header: 'Title', key: 'title', width: 50 },
            { header: 'Body', key: 'body', width: 80 },
          ];

          posts.forEach(p => {
            sheet.addRow({
              id: p.id,
              userId: p.userId,
              title: p.title,
              body: p.body,
            });
          });

          sheetsAdded++;
        }

        if (errors['users']) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Users sheet skipped',
            detail: errors['users'],
          });
        }

        if (errors['posts']) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Posts sheet skipped',
            detail: errors['posts'],
          });
        }

        // EXPORT FILE
        if (sheetsAdded > 0) {

          const buffer = await workbook.xlsx.writeBuffer();
          const timestamp = new Date().toISOString().slice(0, 10);

          saveAs(
            new Blob([buffer]),
            `export_${timestamp}.xlsx`
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Export complete',
            detail: `${sheetsAdded} sheet(s) exported successfully.`,
          });

        } else {

          this.messageService.add({
            severity: 'error',
            summary: 'Export failed',
            detail: 'Both APIs failed. No file was generated.',
          });

        }

      },

      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Export failed',
          detail: 'Unexpected error during export. Please try again.',
        });
      }
    });
  }

  onExportPdf() {
    this.pdfLoading.set(true);

    this.usersService.exportData().subscribe({
      next: ({ users, posts, errors }) => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const timestamp = new Date().toISOString().slice(0, 10);
        let hasContent = false;

        if (users && users.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(40);
          doc.text('Users', 14, 16);

          autoTable(doc, {
            startY: 22,
            head: [['ID', 'Name', 'Username', 'Email', 'Phone', 'Company', 'City']],
            body: users.map(u => [
              u.id,
              u.name,
              u.username,
              u.email,
              u.phone,
              u.company?.name ?? '',
              u.address?.city ?? '',
            ]),
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 14, right: 14 },
          });

          hasContent = true;
        }

        if (posts && posts.length > 0) {
          if (hasContent) doc.addPage();

          doc.setFontSize(14);
          doc.setTextColor(40);
          doc.text('Posts', 14, 16);

          autoTable(doc, {
            startY: 22,
            head: [['ID', 'User ID', 'Title']],
            body: posts.map(p => [p.id, p.userId, p.title]),
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 14, right: 14 },
          });

          hasContent = true;
        }

        // ── Warn about failed APIs ──
        if (errors['users']) {
          this.messageService.add({ severity: 'warn', summary: 'Users skipped', detail: errors['users'] });
        }
        if (errors['posts']) {
          this.messageService.add({ severity: 'warn', summary: 'Posts skipped', detail: errors['posts'] });
        }

        if (hasContent) {
          doc.save(`export_${timestamp}.pdf`);
          this.messageService.add({ severity: 'success', summary: 'PDF exported', detail: 'File downloaded successfully.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'PDF failed', detail: 'Both APIs failed. No file was generated.' });
        }

        this.pdfLoading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'PDF failed', detail: 'Unexpected error. Please try again.' });
        this.pdfLoading.set(false);
      },
    });
  }
}