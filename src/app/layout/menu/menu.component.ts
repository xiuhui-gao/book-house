import { Component, OnInit } from "@angular/core";
import { NavigationService } from "~/app/services/navigation.service";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "bh-menu",
    moduleId: module.id,
    templateUrl: "./menu.component.html",
    styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

    selectedTab = 5;

    constructor(private routerExtensions: RouterExtensions,
        private navigationService: NavigationService) {
    }

    ngOnInit(): void {
    }

    tapMenu(index: number) {
        if (this.selectedTab != index) {
            this.selectedTab = index;
            this.navigationService.setCurrentMenu(index);

            if (this.selectedTab == 0 || this.selectedTab == 1) {
                this.navigate("book-list/" + this.selectedTab);
            } else if (this.selectedTab == 5) {
                this.navigate("calendar");
            }
        }
    }

    private navigate(url: string) {
        this.routerExtensions.navigate([url, {
            animated: true,
            transition: {
                name: "flip",
                duration: 10000,
                curve: "linear"
            }
        }]);
    }
}
