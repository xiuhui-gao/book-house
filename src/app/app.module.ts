import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BookListComponent } from "./book-list/book-list.component";
import { BookListItemComponent } from "./book-list-item/book-list-item.component";
import { BookDetailComponent } from "./book-detail/book-detail.component";
import { MenuComponent } from "./layout/menu/menu.component";
import { ActionBarComponent } from "./layout/action-bar/action-bar.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarEventComponent } from "./calendar-event/calendar-event.component";

import { NavigationService } from "./services/navigation.service";
import { BookService } from "./services/book.service";
import { EventService } from "./services/event.service";
import { BarcodeScanner } from "nativescript-barcodescanner";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        BookListComponent,
        MenuComponent,
        BookDetailComponent,
        ActionBarComponent,
        BookListItemComponent,
        CalendarComponent,
        CalendarEventComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        NavigationService,
        BookService,
        BarcodeScanner,
        EventService
    ]
})
export class AppModule { }
