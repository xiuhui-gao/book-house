import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Book } from "../data/interface";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures/gestures";
import { RouterExtensions } from "nativescript-angular/router";
import { BookService } from "../services/book.service";

@Component({
    selector: "bh-book-list-item",
    moduleId: module.id,
    templateUrl: "./book-list-item.component.html",
    styleUrls: ['./book-list-item.component.css']
})
export class BookListItemComponent implements OnInit {

    @Input() book: Book;

    @Output() deleteEvent = new EventEmitter();

    status: number = 0;

    imageFieldWidth = "25%";

    titleFieldWidth = "75%";

    deleteFieldWidth = "0%";

    constructor(private routerExtensions: RouterExtensions,
        private bookService: BookService) {
    }
å
    ngOnInit(): void {

    }

    onSwipe(args: SwipeGestureEventData) {
        if (args.direction === SwipeDirection.right && this.status == 1) {
            this.setNormalStatus();
        } else if (args.direction === SwipeDirection.left && this.status == 0) {
            this.setDeleteStatus();
        }
    }

    setNormalStatus() {
        this.status = 0;
        this.imageFieldWidth = "25%";
        this.titleFieldWidth = "75%";
        this.deleteFieldWidth = "0%";
    }

    setDeleteStatus() {
        this.status = 1;
        this.imageFieldWidth = "0%";
        this.titleFieldWidth = "75%";
        this.deleteFieldWidth = "25%";
    }

    tapBook(isbn: string) {
        this.navigateToDetail(isbn);
    }

    deleteBook(isbn: string) {
        this.bookService.removeFromList(isbn);
        this.deleteEvent.next();
    }

    navigateToDetail(isbn: string) {
        this.routerExtensions.navigate(["book-detail/" + isbn, {
            animated: true,
            transition: {
                name: "flip",
                duration: 10000,
                curve: "linear"
            }
        }]);
    }
}
