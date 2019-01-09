import { Injectable } from "@angular/core";
import { ActionBar } from "../data/interface";
import { Subject } from "rxjs";


@Injectable()
export class NavigationService {

    actionBarSubject:Subject<ActionBar> = new Subject();

    private _caller: any;

    private _currentMenuItem: number = 0;

    public getCurrentMenu(): number {
        return this._currentMenuItem;
    }

    public setCurrentMenu(menuItem: number) {
        this._currentMenuItem = menuItem;
    }

    updateActionBar(model: ActionBar, callObject?: any) {
        this._caller = callObject;
        this.actionBarSubject.next(model);
    }

    executeCallback(callback, ) {
        callback.call(this._caller);
    }



}