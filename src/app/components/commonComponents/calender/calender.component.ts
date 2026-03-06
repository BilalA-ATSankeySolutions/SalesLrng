import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calender.component.html',
    styleUrls: ['./calender.component.scss']
})
export class CalendarComponent implements OnChanges, OnInit {

    @Input() meetings: any[] = [];

    currentDate = new Date();
    selectedDate: Date | null = null;
    selectedMeetings: any[] = [];
    viewMode: 'month' | 'week' = 'month';
    hoveredDate: string | null = null;

    weeks: { date: Date; isCurrentMonth: boolean; isToday: boolean; meetings: any[] }[][] = [];
    monthLabel = '';
    dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    platformColors: Record<string, string> = {
        'Zoom': '#2D8CFF',
        'Google Meet': '#34A853',
        'Teams': '#6264A7',
        'default': '#f97316'
    };

    platformIcons: Record<string, string> = {
        'Zoom': 'Z',
        'Google Meet': 'M',
        'Teams': 'T',
        'default': '•'
    };

    ngOnInit() {
        this.buildCalendar();
    }

    ngOnChanges() {
        this.buildCalendar();
    }

    buildCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        this.monthLabel = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        const today = new Date();
        this.weeks = [];
        let week: any[] = [];
        let dayCount = 1;
        let nextMonthDay = 1;

        for (let i = 0; i < 42; i++) {
            let date: Date;
            let isCurrentMonth = true;

            if (i < firstDay) {
                date = new Date(year, month - 1, prevMonthDays - firstDay + i + 1);
                isCurrentMonth = false;
            } else if (dayCount > daysInMonth) {
                date = new Date(year, month + 1, nextMonthDay++);
                isCurrentMonth = false;
            } else {
                date = new Date(year, month, dayCount++);
            }

            const isToday = date.toDateString() === today.toDateString();
            const dateStr = date.toISOString().split('T')[0];
            const dayMeetings = this.getMeetingsForDate(date);

            week.push({ date, isCurrentMonth, isToday, meetings: dayMeetings, dateStr });

            if (week.length === 7) {
                this.weeks.push(week);
                week = [];
            }
        }
    }

    // Parses 'Tue, 11 Jul' → Date, guessing the nearest future year
    parseMeetingDate(dayStr: string): Date {
        const now = new Date();
        // Strip leading weekday if present: 'Tue, 11 Jul' → '11 Jul'
        const cleaned = dayStr.replace(/^[A-Za-z]+,\s*/, '').trim();
        // Try current year first, then next year
        for (let offset = 0; offset <= 1; offset++) {
            const attempt = new Date(`${cleaned} ${now.getFullYear() + offset}`);
            if (!isNaN(attempt.getTime())) return attempt;
        }
        return new Date(dayStr); // fallback
    }

    getMeetingsForDate(date: Date): any[] {
        return this.meetings.filter(m => {
            const mDate = this.parseMeetingDate(m.day);
            return mDate.toDateString() === date.toDateString();
        });
    }

    prevMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.buildCalendar();
    }

    nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.buildCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.buildCalendar();
    }

    selectDate(day: any) {
        this.selectedDate = day.date;
        this.selectedMeetings = day.meetings;
    }

    isSelected(day: any): boolean {
        return this.selectedDate?.toDateString() === day.date.toDateString();
    }

    getPlatformColor(platform: string): string {
        return this.platformColors[platform] || this.platformColors['default'];
    }

    getPlatformIcon(platform: string): string {
        return this.platformIcons[platform] || this.platformIcons['default'];
    }

    openMeeting(meeting: any, event?: Event) {
        event?.stopPropagation();
        if (meeting.link) window.open(meeting.link, '_blank');
    }

    getUpcomingMeetings(): any[] {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return [...this.meetings]
            .filter(m => this.parseMeetingDate(m.day) >= now)
            .sort((a, b) => this.parseMeetingDate(a.day).getTime() - this.parseMeetingDate(b.day).getTime())
            .slice(0, 5);
    }

    formatDate(dayStr: string): string {
        const d = this.parseMeetingDate(dayStr);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    isCurrentMonth(): boolean {
        const now = new Date();
        return this.currentDate.getMonth() === now.getMonth() &&
               this.currentDate.getFullYear() === now.getFullYear();
    }
}