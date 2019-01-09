import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationService } from "../services/navigation.service";
import { BookService } from "../services/book.service";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { Book, BookCatagory } from "../data/interface";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { action } from "tns-core-modules/ui/dialogs";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

@Component({
    selector: "bh-book-list",
    moduleId: module.id,
    templateUrl: "./book-list.component.html",
    styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

    books: Array<any> = [];

    title: string;

    catagory: BookCatagory;

    showSearchBar: boolean = false;

    myItems: ObservableArray<any> = new ObservableArray<any>();
    arrayItems: Array<Book> = [];

    constructor(private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private bookService: BookService,
        private barcodeScanner: BarcodeScanner) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.updateActionBar(params.get("catagory"));
        });
    }

    updateActionBar(currentMenu: string) {
        if (currentMenu == "0") {
            this.title = "读书单";
            this.catagory = BookCatagory.READING;
        } else if (currentMenu == "1") {
            this.title = "心愿书单";
            this.catagory = BookCatagory.FAVORITE;
        }
        this.navigationService.updateActionBar({ title: this.title });
        this.loadBooks();
    }

    loadBooks() {
        this.bookService.getBooksByCatagory(this.catagory).subscribe((books) => {
            this.books = books;
        });
    }

    tapAddEvent(): void {
        // this.scanBarcode();

        // for testing in emulator only
        this.searchBook('9787121313011');
    }

    searchBook(isbn: string) {
        this.bookService.getBook(isbn).subscribe((book: Book) => {
            this.navigateToDetail(book.isbn);
        }, (error) => {
            alert('网络请求失败！请稍后再试');
        });
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

    scanBarcode() {
        this.barcodeScanner.scan({
            cancelLabel: "返回",
            cancelLabelBackgroundColor: "#333333",
            message: "扫描书本条形码",
            showFlipCameraButton: true,
            showTorchButton: true
        }).then((result) => {
            let isbnCode = result.text;
            this.searchBook(isbnCode);
        });
    }

    showAddOptionDialog() {
        let options = {
            title: "请选择添加方式",
            cancelButtonText: "取消",
            actions: ["按书名搜索", "扫描条形码"]
        };

        action(options).then(result => {
            if (result == "按书名搜索") {
                this.showSearchBar = true;
            } else if (result == "扫描条形码") {
                this.scanBarcode();
                // this.searchBook('9787121313011');
            }
        });
    }

    seachTextChange(args) {
        this.arrayItems = [];
        let searchBar = <SearchBar>args.object;
        let keyWord = searchBar.text;
        if (keyWord == null || keyWord == '') {
            this.showSearchBar = false;
            searchBar.dismissSoftInput();
        } else {
            this.bookService.searchBookByName(keyWord).subscribe(
                (books: Array<Book>) => {
                    books.forEach((book: Book) => {
                        this.arrayItems.push(book);
                    })
                    this.myItems = new ObservableArray<any>(this.arrayItems);
                }, (error) => {
                    this.myItems = new ObservableArray<any>(this.arrayItems);
                    console.error(error);
                    alert('网络请求失败！请稍后再试');
                }
            );
        }
    }
}
