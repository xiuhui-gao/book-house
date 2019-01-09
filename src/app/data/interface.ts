export interface Book {
    isbn: string;
    title: string;
    summary: string;
    image: string;
    catagory: BookCatagory;
}

export interface ActionBar {
    title: string;
    showLeftButton?: boolean;
    showRightButton?: boolean;
    leftButtonStyleIcon?: StyleIcon;
    rightButtonStyleIcon?: StyleIcon;
    leftButtonTapCallback?: Function;
    rightButtonTapCallback?: Function;
}

export enum StyleIcon {
    DONE,
    CANCEL,
    EDIT,
    SAVE,
    ADD,
    ADD_EVENT,
    ADD_TO_FAVORITE,
    ADD_TO_READING,
    CAMERA,
    MORE,
    NONE
}

export enum BookCatagory {
    DEFAULT,
    READING,
    FAVORITE
}

export interface CaldenerDate {
    label?: string;
    wrappedDate?: Date;
    type?: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    comment?: string;
    eventGroupId: string;
}