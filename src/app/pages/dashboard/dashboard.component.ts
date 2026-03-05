import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OverviewComponent } from '../../components/dashboard/overview/overview.component';
import { InsightsComponent } from '../../components/dashboard/insights.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AnalyticsComponent } from '../../components/dashboard/analyse/analyse.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { UserProfileComponent } from '../../components/dashboard/user-profile/user-profile.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterOutlet, MatTabsModule, OverviewComponent, InsightsComponent, NavbarComponent, AnalyticsComponent, UserProfileComponent],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

    constructor(private router: Router, private route: ActivatedRoute) {}

    selectedIndex = 0;
    
    tabRoutes = [ 'overview', 'profile', 'insights', 'analyse'];

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