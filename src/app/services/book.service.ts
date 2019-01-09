import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { BookCatagory, Book } from "../data/interface";
var Sqlite = require("nativescript-sqlite");

const API_URL: string = 'https://api.douban.com/v2/book';
const QUERY_BY_ISBN_URL: string = API_URL + '/isbn/';
const QUERY_BY_NAME_URL: string = API_URL + "/search";
const QUERY_DETAIL_URL: string = API_URL + "/:id";

const SQL_CREATE_TABLE_BOOK = "CREATE TABLE IF NOT EXISTS book (isbn TEXT primary key, title TEXT, summary TEXT, image TEXT, catagory TEXT)";
const SQL_QUERY_BOOK_BY_ISBN = "SELECT * FROM book WHERE isbn = ?";
const SQL_QUERY_BOOK_BY_CATAGORY = "SELECT * FROM book WHERE catagory = ?";
const SQL_INSERT_BOOK = "INSERT INTO book (isbn, title, summary, image, catagory) values (?, ?, ?, ?, ?)";
const SQL_UPDATE_BOOK_CATAGORY_BY_ISBN = "UPDATE book SET catagory = ? WHERE isbn = ?"

@Injectable()
export class BookService {

    private _bookDatabase: any;

    constructor(private http: HttpClient) {
        (new Sqlite("book.db")).then(db => {
            db.execSQL(SQL_CREATE_TABLE_BOOK).then(id => {
                this._bookDatabase = db;
            }), error => {
                console.log("create table error", error);
            }
        }), error => {
            console.log("open db error", error);
        };
    }

    public searchBookByName(name: string): Observable<Array<Book>> {
        let data: HttpParams = new HttpParams().set('q', name);
        return this.http.get(QUERY_BY_NAME_URL, { params: data }).pipe(map((data: any) => data.books))
            .pipe(map((books: Array<any>) => {
                let mappedArray: Array<Book> = [];
                books.forEach((data: any) => {
                    let result: Book = {
                        isbn: data.isbn13,
                        title: data.title,
                        summary: data.summary,
                        image: data.image,
                        catagory: BookCatagory.DEFAULT
                    }
                    mappedArray.push(result);
                });
                return mappedArray;
            }));
    }

    getBook(isbn: string): Observable<Book> {
        return this._getBookFromLocal(isbn).pipe(
            switchMap((localBook: Book) => {
                if (localBook) {
                    return of(localBook);
                } else {
                    console.log('book not found in local, will send http to retrifve the book');
                    return this._getBookViaHttp(isbn);
                }
            })
        );
    }

    private _getBookFromLocal(isbn: string): Observable<Book> {
        return from(this._bookDatabase.all(SQL_QUERY_BOOK_BY_ISBN, [isbn])).pipe(map((resultSet) => {
            let row = resultSet[0];
            if (row) {
                let result: Book = {
                    isbn: row[0],
                    title: row[1],
                    summary: row[2],
                    image: row[3],
                    catagory: row[4]
                };
                return result;
            } else {
                return null;
            }
        }));


    }

    private _insertBookToLocal(book: Book) {
        this._bookDatabase.execSQL(SQL_INSERT_BOOK, [book.isbn, book.title, book.summary, book.image, book.catagory]).then((id) => {
            console.log("new record is id: ", id);
        });;
    }

    private _getBookViaHttp(isbn: string): Observable<Book> {
        let queryURL = QUERY_BY_ISBN_URL + isbn;
        return this.http.get(queryURL).pipe(map((data: any) => {
            let result: Book = {
                isbn: data.isbn13,
                title: data.title,
                summary: data.summary,
                image: data.image,
                catagory: BookCatagory.DEFAULT
            }
            this._insertBookToLocal(result);
            return result;
        }));
    }

    getBooksByCatagory(catagory: BookCatagory): Observable<Array<Book>> {
        return from(this._bookDatabase.all(SQL_QUERY_BOOK_BY_CATAGORY, [catagory])).pipe(map((result: Array<any>) => {
            let books: Array<Book> = [];
            result.forEach((row) => {
                let book = {
                    isbn: row[0],
                    title: row[1],
                    summary: row[2],
                    image: row[3],
                    catagory: row[4]
                };
                books.push(book);
            })
            return books;
        }));
    }

    addToReadingList(isbn: string) {
        this._changeBookCatagory(isbn, BookCatagory.READING);
    }

    addToFavorateList(isbn: string) {
        this._changeBookCatagory(isbn, BookCatagory.FAVORITE);
    }

    removeFromList(isbn: string) {
        this._changeBookCatagory(isbn, BookCatagory.DEFAULT);
    }

    private _changeBookCatagory(isbn: string, catagory: BookCatagory) {
        this._bookDatabase.execSQL(SQL_UPDATE_BOOK_CATAGORY_BY_ISBN, [catagory, isbn]).then((id) => {
            console.log("record is updated: ", id);
        });


    }
}
