import {
    Component,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexFill, ApexStroke, ApexGrid, ApexTooltip, ApexDataLabels, ApexYAxis, ApexLegend } from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    fill: ApexFill;
    stroke: ApexStroke;
    grid: ApexGrid;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    legend: ApexLegend;
    colors: string[];
};

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
    chartOptions: ChartOptions = {
        series: [
            { name: 'Maximum of focus', data: [38, 55, 42, 60, 35, 65, 48, 72, 50, 58, 44, 68, 52, 42, 60, 75, 55, 80, 62, 50, 66, 54, 45, 70] },
            { name: 'Min or lack of focus', data: [18, 28, 22, 35, 18, 38, 28, 42, 25, 33, 20, 38, 30, 20, 36, 45, 30, 50, 35, 24, 38, 28, 20, 40] },
        ],
        chart: {
            type: 'area',
            height: 200,
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent',
            fontFamily: "'DM Sans', sans-serif",
            animations: { enabled: true, speed: 800 },
        },
        colors: ['#f76f7a', '#7c8cf8'],
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 90, 100] },
        },
        stroke: { curve: 'smooth', width: 2.5 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: [
                'W1', 'W2', 'W3', 'W4',
                'W1', 'W2', 'W3', 'W4',
                'W1', 'W2', 'W3', 'W4',
                'W1', 'W2', 'W3', 'W4',
                'W1', 'W2', 'W3', 'W4',
                'W1', 'W2', 'W3', 'W4',
            ],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false },
        },
        yaxis: { show: false },
        grid: {
            borderColor: '#f0f2f8',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { left: 0, right: 0, top: -10, bottom: 0 },
        },
        legend: { show: false },
        tooltip: {
            theme: 'light',
            style: { fontSize: '12px', fontFamily: "'DM Sans', sans-serif" },
            y: { formatter: (v: number) => v + '%' },
        },
    };

    selectedRange = 'Last month';
    rangeOptions = ['Last month', 'Last 3 months', 'Last 6 months'];

    profile = {
        name: 'Kristin Watson',
        designation: 'Design Manager',
        connections: 11,
        checks: 56,
        trophies: 12,
    };

    meetings = [
        {
            day: 'Tue, 11 Jul',
            time: '08:15 am',
            name: 'Quick Daily Meeting',
            app: 'Zoom',
            icon: 'https://img.icons8.com/?size=100&id=7csVZvHoQrLW&format=png&color=000000',
        },
        {
            day: 'Tue, 11 Jul',
            time: '09:30 pm',
            name: 'John Onboarding',
            app: 'Google Meet',
            icon: 'https://img.icons8.com/?size=100&id=pE97I4t7Il9M&format=png&color=000000',
        },
        {
            day: 'Tue, 12 Jul',
            time: '02:30 pm',
            name: 'Call With a New Team',
            app: 'Google Meet',
            icon: 'https://img.icons8.com/?size=100&id=pE97I4t7Il9M&format=png&color=000000',
        },
        {
            day: 'Tue, 15 Jul',
            time: '04:00 pm',
            name: 'Lead Designers Event',
            app: 'Zoom',
            icon: 'https://img.icons8.com/?size=100&id=7csVZvHoQrLW&format=png&color=000000',
        },
    ];

    developedAreas = [
        { name: 'Sport Skills', percent: 71, trend: 'down' },
        { name: 'Blogging', percent: 92, trend: 'up' },
        { name: 'Leadership', percent: 33, trend: 'down' },
        { name: 'Meditation', percent: 56, trend: 'up' },
        { name: 'Philosophy', percent: 79, trend: 'up' },
    ];

    tasks = {
        prioritized: 83,
        additional: 56,
    };

    trackersConnected = [
        {
            name: 'Figma',
            icon: 'https://img.icons8.com/?size=100&id=W0YEwBDDfTeu&format=png&color=000000',
        },
        {
            name: 'Teams',
            icon: 'https://img.icons8.com/?size=100&id=zQ92KI7XjZgR&format=png&color=000000',
        },
        {
            name: 'Slack',
            icon: 'https://img.icons8.com/?size=100&id=5nhKmqUrXtmq&format=png&color=000000',
        },
    ];

    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    activeMonthIndex = 8;

    private get rangeWindow(): { above: number; below: number } {
        switch (this.selectedRange) {
            case 'Last 3 months': return { above: 1, below: 1 };
            case 'Last 6 months': return { above: 2, below: 3 };
            default: return { above: 1, below: 2 }; // show 4 months
        }
    }

    get visibleMonthsStartIndex(): number {
        const { above } = this.rangeWindow;
        return Math.max(0, this.activeMonthIndex - above);
    }

    get visibleMonths(): string[] {
        const { above, below } = this.rangeWindow;
        const start = Math.max(0, this.activeMonthIndex - above);
        const end = Math.min(this.months.length, this.activeMonthIndex + below + 1);
        return this.months.slice(start, end);
    }

    get selectedMonthIndices(): Set<number> {
        const { above, below } = this.rangeWindow;
        const indices = new Set<number>();
        for (let offset = -above; offset <= below; offset++) {
            const idx = this.activeMonthIndex + offset;
            if (idx >= 0 && idx < this.months.length) indices.add(idx);
        }
        return indices;
    }

    scrollMonthUp(): void {
        if (this.activeMonthIndex > 0) this.activeMonthIndex--;
    }

    scrollMonthDown(): void {
        if (this.activeMonthIndex < this.months.length - 1) this.activeMonthIndex++;
    }
}