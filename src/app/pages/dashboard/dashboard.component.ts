import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterOutlet, MatTabsModule, NavbarComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    constructor(private router: Router, private route: ActivatedRoute) {}

    selectedIndex = 0;
    
    tabRoutes = ['overview', 'profile', 'insights', 'analyse'];

    ngOnInit() {
        const currentTab = this.route.snapshot.firstChild?.routeConfig?.path;
        this.selectedIndex = this.tabRoutes.indexOf(currentTab || 'overview');
    }

    onTabChange(index: number) {
        const route = this.tabRoutes[index];
        this.selectedIndex = index;
        this.router.navigate([route], { relativeTo: this.route });
    }
}