import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import { StyleIcon } from "../data/interface";
import { RouterExtensions } from "nativescript-angular/router";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures/gestures";

@Component({
    selector: "bh-calendar-event",
    moduleId: module.id,
    templateUrl: "./calendar-event.component.html",
    styleUrls: ['./calendar-event.component.css']
})

export class CalendarEventComponent implements OnInit {

    constructor(private navigationService: NavigationService,
        private routerExtensions: RouterExtensions) {

    }

    ngOnInit(): void {
        this.updateActionBar();
    }

    updateActionBar() {
        this.navigationService.updateActionBar({ 
            title: "新建事件",
            showLeftButton: true,
            leftButtonStyleIcon: StyleIcon.CANCEL,
            leftButtonTapCallback: this.back
        }, this);
    }
    
    onSwipe(args: SwipeGestureEventData) {

        if (args.direction === SwipeDirection.right) {
            //swipe right the page navigate back to the previous page
            this.back();
        }
    }

    back() {
        this.routerExtensions.back();
    }
    
}
