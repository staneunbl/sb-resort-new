import { BooleanLiteral } from "typescript";
import { number } from "zod";


export interface MainOptions {
    label: string;
    value: string;
}
export interface FilterByCol {
    column: string;
    filterValue: any;
}

export interface RoomType {
    Id: string;
    Name: string;
    Description: string;
    MaxAdult: number;
    MaxChild: number;
    Rooms: {
        count: number
    },
    BedTypes: {
        Id: string,
        TypeName: string,
        CreatedAt: Date
    },
    Images: string[]
}

export interface Room {
    Id: string;
    RoomNumber: number;
    TypeName: string;
    StatusName: string;
    CreatedAt: Date;
    RoomTypeId: number;
    StatusId: number;
}
// interface RoomRate {
//     Id: number;
//     RateTypeId: number;
//     ValidFrom: Date | null;
//     ValidTo: Date | null;
//     BaseRoomRate: number;
//     ExtraChildRate: number;
//     ExtraAdultRate: number;
//     RoomTypeId: number;
//     CreatedAt: Date;
//     StatusId: number;
//     RoomType: string;
//     StatusName: string;
//     RateType: string;
// }

export interface RoomRate {
    "RateTypeId": number,
    "RoomTypeId": number,
    "RoomType": string,
    "MaxAdult": number,
    "MaxChild": number,
    "Description": string,
    "BedTypeId": number,
    "Id": number,
    "BaseRoomRate": number,
    "ExtraAdultRate": number,
    "ExtraChildRate": number,
    "WeekendExtraAdultRate": number,
    "WeekendExtraChildRate": number,
    "WeekendRoomRate": number,
    "CreatedAt": Date
}

export interface RoomAmenityResponse {
    RoomTypeId: number,
    Amenities: RoomAmenity[]
}

export interface RoomAmenity {
    Id: number,
    Label: string,
    Description: string,
}

export interface Reservation{
    Id: number;
    RoomCount: number;
    RoomTypeId: number;
    CheckInDate: Date;
    CheckOutDate: Date;
    CreatedAt: Date;
    GuestId: number | null;
    StatusId: number;
    ExtraChild: number;
    ExtraAdult: number;
    ReservationTypeId: number;
    isDeleted: boolean;
    isBilled: boolean;
    ReservationStatus: string;
    RoomType: string;
    ReservationType: string;
    GuestData: {
        FirstName: string;
        LastName: string;
    } | null;
    Remarks: string;
}

export interface ImageUploadObject {
    name: string,
    url: string,
    size: number,
    file: File,
    isSizeExceeded: boolean
}

export interface ReservationSummaryRecord {
    reservationId: number,
    firstName: string,
    lastName: string,
    roomType: string,
    roomNumber: number,
    checkInDate: Date,
    checkOutDate: Date,
    request: string,
    addOns: AddOn[],
    extraAdult: number,
    extraChild: number,
    baseRate: number,
    extraAdultRate: number,
    extraChildRate: number,
    WEBaseRate: number,
    WEAdultRate: number,
    WEChildRate: number,
    deposit: number,
    status: string
    
}

export interface AddOn {
    id: number,
    name: string,
    price: number,
    isDeleted: boolean,
    addOnTypeId: number
}