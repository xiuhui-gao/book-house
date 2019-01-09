import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { BookListComponent } from "./book-list/book-list.component";
import { BookDetailComponent } from "./book-detail/book-detail.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarEventComponent } from "./calendar-event/calendar-event.component";

const routes: Routes = [
    // { path: "", redirectTo: "/book-list/0", pathMatch: "full" },
    { path: "", redirectTo: "calendar", pathMatch: "full" },
    { path: "book-list/:catagory", component: BookListComponent },
    { path: "book-detail/:isbn", component: BookDetailComponent },
    { path: "calendar", component: CalendarComponent},
    { path: "event", component: CalendarEventComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
