import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import { CaldenerDate, StyleIcon } from "../data/interface";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "bh-calendar",
    moduleId: module.id,
    templateUrl: "./calendar.component.html",
    styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {

    days: Array<string> = [];

    today: Date = new Date();

    currentYear: number;

    currentMonth: number;

    currentMonthFirstDay: number;

    daysForShow: Array<CaldenerDate> = [];

    selectedDate: Date;

    constructor(private navigationService: NavigationService, private routerExtensions: RouterExtensions) {
        this.selectedDate = this.today;
        this.cacluldateCalendar(this.today);
    }

    ngOnInit(): void {
        this.updateActionBar();
        for (let i=1; i <= 31; i++) {
            this.days.push('' + i);
        }
        
        // this.today.setDate(1);
    }

    updateActionBar() {
        this.navigationService.updateActionBar({ 
            title: "日历",
            showRightButton: true,
            rightButtonStyleIcon: StyleIcon.ADD_EVENT,
            rightButtonTapCallback: this.addEvent
        }, this);
    }

    cacluldateCalendar(date: Date) {
        this.daysForShow = [];
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth();
        let currentMonthFirstDate: Date = new Date(this.currentYear, this.currentMonth, 1);
        this.currentMonthFirstDay = currentMonthFirstDate.getDay();
        this.addEmptyDatesToCalendar(this.currentMonthFirstDay);
        this.addDatesToCalendar(currentMonthFirstDate);
        this.addEmptyDatesToCalendar(7 - this.daysForShow.length % 7);
    }

    addEmptyDatesToCalendar(n: number) {
        for (let i=0; i<n; i++) {
            this.daysForShow.push({type: -1});
        }
    }

    addDatesToCalendar(startDate: Date) {
        let tempDate = new Date(startDate);
        while (tempDate.getMonth() == startDate.getMonth()) {
            this.daysForShow.push({wrappedDate: tempDate, label: '' + tempDate.getDate()});
            tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1);
        }
    }

    isToday(d: Date) {
        if (d == null || this.today == null) {
            return false;
        }
        return d.toDateString() === this.today.toDateString();
    }

    addCalendarMonth() {
        if (this.currentMonth == 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        let changedDate = new Date(this.currentYear, this.currentMonth, 1);
        this.cacluldateCalendar(changedDate);
    }

    minusCalendarMonth() {
        if (this.currentMonth == 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        let changedDate = new Date(this.currentYear, this.currentMonth, 1);
        this.cacluldateCalendar(changedDate);
    }

    selectCalendarDay(day: CaldenerDate) {
        if (day.type != -1)
            this.selectedDate = day.wrappedDate;
    }

    addEvent() {
        console.log('click add event');
        this.routerExtensions.navigate(["event", {
            animated: true,
            transition: {
                name: "flip",
                duration: 10000,
                curve: "linear"
            }
        }]);
    }
}
