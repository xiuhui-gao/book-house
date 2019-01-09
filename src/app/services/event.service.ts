import { Injectable } from "@angular/core";
import { CalendarEvent } from "../data/interface";
var Sqlite = require("nativescript-sqlite");

const SQL_CREATE_TABLE_EVENT = "CREATE TABLE IF NOT EXISTS event (id TEXT primary key, title TEXT, startTime DATETIME, endTime DATETIME, comment TEXT, eventGroupId TEXT)";
// const SQL_QUERY_BOOK_BY_ISBN = "SELECT * FROM book WHERE isbn = ?";
// const SQL_QUERY_BOOK_BY_CATAGORY = "SELECT * FROM book WHERE catagory = ?";
// const SQL_INSERT_BOOK = "INSERT INTO book (isbn, title, summary, image, catagory) values (?, ?, ?, ?, ?)";
// const SQL_UPDATE_BOOK_CATAGORY_BY_ISBN = "UPDATE book SET catagory = ? WHERE isbn = ?"

@Injectable()
export class EventService {

    private _eventDatabase: any;

    private allEvents: Array<CalendarEvent> = [];

    // export interface CalendarEvent {
    // id: string;
    //     title: string;
    //     startTime: Date;
    //     endTime: Date;
    //     comment?: string;
    //     eventGroupId?: string;
    // }
    constructor() {
        (new Sqlite("event.db")).then(db => {
            db.execSQL(SQL_CREATE_TABLE_EVENT).then(id => {
                this._eventDatabase = db;
                this._eventDatabase.all("SELECT * FROM event").then((resultSet: Array<any>) => {
                    resultSet.forEach((row) => {
                        let calendarEvent: CalendarEvent = {
                            id: row[0],
                            title: row[1],
                            startTime: row[2],
                            endTime: row[3],
                            comment: row[4],
                            eventGroupId: row[5]
                        }
                        this.allEvents.push(calendarEvent);
                    });
                })
            }), error => {
                console.log("create table error", error);
            }
        }), error => {
            console.log("open db error", error);
        };
    }

}
