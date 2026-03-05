import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class CommonService {

    constructor(private messageService: MessageService, private confirmation: ConfirmationService) { }

    confirm(
        message: string,
        acceptCallback: () => void,
        header: string = 'Confirmation', 
    ) {
        this.confirmation.confirm({
            header,
            message,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-success',
            rejectButtonStyleClass: 'p-button-danger',
            accept: acceptCallback
        });
    }

    success(message: string, summary: string = 'Success') {
        this.messageService.add({
            severity: 'success',
            summary,
            detail: message,
            life: 3000
        });
    }

    error(message: string, summary: string = 'Error') {
        this.messageService.add({
            severity: 'error',
            summary,
            detail: message,
            life: 3000
        });
    }

    info(message: string, summary: string = 'Info') {
        this.messageService.add({
            severity: 'info',
            summary,
            detail: message,
            life: 3000
        });
    }
}