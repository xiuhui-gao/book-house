import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap }  from "@angular/router";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures/gestures";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "../services/navigation.service";
import { StyleIcon, Book, BookCatagory } from "../data/interface";
import { BookService } from "../services/book.service";
import { shiftInitState } from "@angular/core/src/view";

@Component({
    selector: "bh-book-detail",
    moduleId: module.id,
    templateUrl: "./book-detail.component.html",
    styleUrls: ['./book-detail.component.css']
})

export class BookDetailComponent implements OnInit {

    book: Book;

    constructor(private routerExtensions: RouterExtensions,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private bookService: BookService) {
    }

    ngOnInit(): void {
        let isbn: string = this.route.snapshot.paramMap.get('isbn');
        this.bookService.getBook(isbn).subscribe((data: Book) => {
            this.book = data;
            let catagory: BookCatagory = this.book.catagory;
            let currentMenu: number = this.navigationService.getCurrentMenu();

            let showRightButton: boolean = false;
            let rightButtonSytleIcon: StyleIcon;
            let rightButtonCallback: Function;

            switch (catagory) {
                case BookCatagory.DEFAULT:
                    showRightButton = true;
                    if (currentMenu == 0) {
                        rightButtonSytleIcon = StyleIcon.ADD_TO_READING;
                        rightButtonCallback = this.addBookToReadingList;
                    } else if (currentMenu == 1) {
                        rightButtonSytleIcon = StyleIcon.ADD_TO_FAVORITE;
                        rightButtonCallback = this.addBookToFavoriteList;
                    }
                    break;
                case BookCatagory.READING:
                    showRightButton = false;
                    break;
                case BookCatagory.FAVORITE:
                    showRightButton = true;
                    rightButtonSytleIcon = StyleIcon.ADD_TO_READING;
                    rightButtonCallback = this.addBookToReadingList;
                    break;
            }
            
            this.navigationService.updateActionBar({
                title: this.book.title,
                showLeftButton: true,
                leftButtonStyleIcon: StyleIcon.CANCEL,
                leftButtonTapCallback: this.back,
                showRightButton: showRightButton,
                rightButtonStyleIcon: rightButtonSytleIcon,
                rightButtonTapCallback: rightButtonCallback
            }, this);
        });
    }

    addBookToReadingList() {
        this.bookService.addToReadingList(this.book.isbn);
        this.back();
    }

    addBookToFavoriteList() {
        this.bookService.addToFavorateList(this.book.isbn);
        this.back();
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
