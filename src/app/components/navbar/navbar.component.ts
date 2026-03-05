import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [ButtonModule],
    template: `
    <div class="navbar">
      <div class="logo">Sales</div>

      <button 
        pButton 
        label="Logout" 
        icon="pi pi-sign-out"
        class="p-button-danger"
        (click)="logout()">
      </button>
    </div>
  `,
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    constructor(private auth: AuthService, private router: Router, private common: CommonService) { }


    logout() {
        this.common.confirm(
            'Are you sure you want to logout?',
            () => {
                this.auth.logout(false);
            },
            'Logout'
        );
    }
}