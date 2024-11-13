import { addDays } from "date-fns";
import { create } from "zustand";



export const useBookingStore = create<BookingStore>()((set) => ({
    pageState: 0,
    goNextPage: () => set((state) => {
        return (state.pageState < 4) ? { ...state, pageState: state.pageState + 1 } : state
    }),
    goPrevPage: () => set((state) =>
        (state.pageState > 0) ? { ...state, pageState: state.pageState - 1 } : state),
    goToRoomRates: () => set((state) => ({ ...state, pageState: 2 })),
    goToBookingDate: () => set((state) => ({ ...state, pageState: 0 })),

    numberOfRooms: 1,

    referenceNumber: "",
    setReferenceNumber: (referenceNumber: string) => set((state) => ({ ...state, referenceNumber })),

    checkInRange: { from: new Date(), to: addDays(new Date(), 1) },
    promoCode: "",
    setNumberOfRooms: (numberOfRooms: number) => set((state) => ({ ...state, numberOfRooms })),
    setCheckInRange: ({ from, to }: { from: Date, to: Date }) => set((state) => ({ ...state, checkInRange: { from, to } })),
    setPromoCode: (promocode: string) => set((state) => ({ ...state, promoCode: promocode })),
    promoDetails: {},
    setPromoDetails: (promo: any) => set((state) => ({ ...state, promoDetails: promo })),

    roomId: 0,
    extraAdult: 0,
    extraChild: 0,
    selectedRoom: {},
    selectedRoomRate: {},
    setSelectedRoomRate: (roomrate: any) => set((state) => ({ ...state, selectedRoomRate: roomrate })),
    setSelectedRoom: (room: any) => set((state) => ({ ...state, selectedRoom: room })),
    setRoomId: (roomId: number) => set((state) => ({ ...state, roomId })),
    setExtraAdult: (extraPerson: number) => set((state) => ({ ...state, extraAdult: extraPerson })),
    setExtraChild: (extraPerson: number) => set((state) => ({ ...state, extraChild: extraPerson })),

    adultGuests: 1,
    setAdultGuests: (data) => set(() => ({ adultGuests: data })),
    childGuests: 0,
    setChildGuests: (data) => set(() => ({ childGuests: data })),

    ToSPrivacyModalState: false,
    setToSPrivacyModalState: (isOpen: boolean) => set((state) => ({ ...state, ToSPrivacyModalState: isOpen })),

    lightboxModalState: false,
    setLightboxModalState: (isOpen: boolean) => set((state) => ({ ...state, lightboxModalState: isOpen })),

    firstName: "",
    lastName: "",
    birthDate: new Date("1990-01-01"),
    nationality: "",
    email: "",
    contactNumber: "",
    country: "",
    request: "",

    setFirstName: (firstName: string) => set((state) => ({ ...state, firstName })),
    setLastName: (lastName: string) => set((state) => ({ ...state, lastName })),
    setBirthDate: (birthDate: Date) => set((state) => ({ ...state, birthDate })),
    setNationality: (nationality: string) => set((state) => ({ ...state, nationality })),
    setEmail: (email: string) => set((state) => ({ ...state, email })),
    setContactNumber: (contactNumber: string) => set((state) => ({ ...state, contactNumber })),
    setCountry: (country: string) => set((state) => ({ ...state, country })),
    setRequest: (request: string) => set((state) => ({ ...state, request })),
    dateDetails: {

    },
    setDateDetails: (dateDetails: any) => set((state) => ({ ...state, dateDetails })),
    initialBill: 0,
    setInitialBill: (initialBill: number) => set((state) => ({ ...state, initialBill })),

    resetStore: () => set((state) => ({
        //pageState: 0,
        numberOfRooms: 1,
        checkInRange: { from: new Date(), to: new Date() },
        promoCode: "",
        roomId: 0,
        extraAdult: 0,
        extraChild: 0,
        selectedRoom: {},
        selectedRoomRate: {},
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        nationality: "",
        email: "",
        contactNumber: "",
        dateDetails: {},
        initialBill: 0,
        appliedDiscount: {} as any,
    })),

    appliedDiscount: {} as any,
    setAppliedDiscount: (data: any) => set((state) => ({ ...state, appliedDiscount: data }))

}))

interface BookingStore {
    pageState: number;/*  */
    goNextPage: () => void
    goPrevPage: () => void
    checkInRange: { from: Date, to: Date };
    setCheckInRange: ({ from, to }: { from: Date, to: Date }) => void
    goToRoomRates: () => void
    goToBookingDate: () => void
    numberOfRooms: number
    promoCode: string
    setNumberOfRooms: (numberOfRooms: number) => void
    setPromoCode: (promocode: string) => void
    promoDetails: any
    setPromoDetails: (data: any) => void

    referenceNumber: string
    setReferenceNumber: (referenceNumber: string) => void

    extraAdult: number
    extraChild: number
    selectedRoom: any
    selectedRoomRate: any
    setSelectedRoomRate: (roomrate: any) => void
    setSelectedRoom: (room: any) => void
    setExtraAdult: (extraPerson: number) => void
    setExtraChild: (extraPerson: number) => void

    adultGuests: number;
    setAdultGuests: (data: number) => void;
    childGuests: number;
    setChildGuests: (data: number) => void;

    firstName: string
    setFirstName: (firstName: string) => void
    lastName: string
    setLastName: (lastName: string) => void
    birthDate: Date
    setBirthDate: (birthDate: Date) => void
    nationality: string
    setNationality: (nationality: string) => void
    email: string
    setEmail: (email: string) => void
    contactNumber: string
    setContactNumber: (contactNumber: string) => void
    country: string
    setCountry: (country: string) => void
    request: string
    setRequest: (request: string) => void

    lightboxModalState: boolean
    setLightboxModalState: (isOpen: boolean) => void

    ToSPrivacyModalState: boolean
    setToSPrivacyModalState: (isOpen: boolean) => void

    dateDetails: any
    setDateDetails: (dateDetails: any) => void
    initialBill: number
    setInitialBill: (initialBill: number) => void
    resetStore: () => void

    appliedDiscount: { id: number, name: string, code: string, type: string, value: number }
    setAppliedDiscount: (discount: { id: number, name: string, code: string, type: string, value: number }) => void
}