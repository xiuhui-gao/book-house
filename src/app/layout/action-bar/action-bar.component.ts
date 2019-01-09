import { Component, OnInit, NgZone } from "@angular/core";
import { ActionBar, StyleIcon } from "../../data/interface";
import { NavigationService } from "~/app/services/navigation.service";
import { Page } from "tns-core-modules/ui/page/page";
import { Action } from "rxjs/internal/scheduler/Action";


@Component({
    selector: "bh-action-bar",
    moduleId: module.id,
    templateUrl: "./action-bar.component.html",
    styleUrls: ['./action-bar.component.css']
})

export class ActionBarComponent implements OnInit {

    actionBarModel: ActionBar;

    showLeftButton: boolean;

    showRightButton: boolean;

    leftButtonContent: string;

    rightButtonContent: string;

    constructor(private navigationService: NavigationService, private page: Page) {
    }

    ngOnInit(): void {
        this.navigationService.actionBarSubject.subscribe((model) => {
            this.actionBarModel = model;
            this.showLeftButton = model.showLeftButton;
            this.showRightButton = model.showRightButton;
            this.leftButtonContent = this.getButtonContent(model.leftButtonStyleIcon);
            this.rightButtonContent = this.getButtonContent(model.rightButtonStyleIcon);
        });
    }

    getButtonContent(style: StyleIcon): string {
        switch (style) {
            case StyleIcon.DONE:
                return "完成";
            case StyleIcon.CANCEL:
                return "取消";
            case StyleIcon.EDIT:
                return "编辑";
            case StyleIcon.SAVE:
                return "保存";
            case StyleIcon.ADD:
                return "新建";
            case StyleIcon.ADD_EVENT:
                return "新建事件";
            case StyleIcon.ADD_TO_FAVORITE:
                return "加入书单";
            case StyleIcon.ADD_TO_READING:
                return "加入书单";
            case StyleIcon.MORE:
                return "...";
            case StyleIcon.CAMERA:
                return "摄像头";
            default:
                return "";
        }
    }

    tapLeftButton() {
        if (this.actionBarModel.leftButtonTapCallback) {
            this.navigationService.executeCallback(this.actionBarModel.leftButtonTapCallback);
        }
    }

    tapRightButton() {
        if (this.actionBarModel.rightButtonTapCallback) {
            this.navigationService.executeCallback(this.actionBarModel.rightButtonTapCallback);
        }
    }
}
