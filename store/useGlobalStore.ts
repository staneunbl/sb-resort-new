import {
  getAmenities,
  getAvailableRoomsRPC,
  getBedTypeOptions,
  getCurrentRoomTypesRate,
  getRoomRates,
  getRoomRateTypeOptions,
  getRooms,
  getRoomStatusOptions,
  getRoomTypeOptions,
} from "@/app/ServerAction/rooms.action";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { enUS, ja, Locale } from "date-fns/locale";
import { getAddOns, getAddOnsTypeOpt, getBillings, getReservations } from "@/app/ServerAction/reservations.action";
import { getGuests, getUsers } from "@/app/ServerAction/manage.action";
import { getPromos } from "@/app/ServerAction/promos.action";
import { getDeviceReservation } from "@/app/ServerAction/reports.action";
import { DateRange } from "react-day-picker";

export const useGlobalStore = create<GlobalState>()((set) => ({

  companyName: "ABCName",
  setCompanyName: (name: string) => set(() => ({companyName: name})),

  imageUploadMaxMB: 2,
  setImageUploadMaxMB: (data: number) => set(() => ({imageUploadMaxMB: data})),

  localeFns: {
    en: enUS,
    ja: ja,
  },
  /* Add/Edit RoomForm States */
  selectedRoomData: null,
  setSelectedRoomData: (data) => set(() => ({ selectedRoomData: data })),

  roomFormModalState: false,
  setRoomFormModalState: (data) => set(() => ({ roomFormModalState: data })),
  /* Add/Edit RoomRates States */
  selectedRateData: "",
  setSelectedRateData: (data) => set(() => ({ selectedRateData: data })),
  rateFormModalState: false,
  setRateFormModalState: (data) => set(() => ({ rateFormModalState: data })),

  /* Reservation */
  reservationFormModalState: false,
  setReservationFormModalState: (data) =>
    set(() => ({ reservationFormModalState: data })),
  selectedReservationData: {} as Reservation,
  setSelectedReservationData: (data) =>
    set(() => ({ selectedReservationData: data })),

  // Available Rooms

  availableRoomsDateSelect: { from: new Date(), to: new Date() },
  setAvailableRoomsDateSelect: (data) =>
    set(() => ({ availableRoomsDateSelect: data })),

  /* Billing Form Modal */
  billingFormModalState: false,
  setBillingFormModalState: (data) =>
    set(() => ({ billingFormModalState: data })),
  selectedBillingData: {},
  setSelectedBillingData: (data) => set(() => ({ selectedBillingData: data })),
  billingAddOnFormModalState: false,
  setBillingAddOnFormModalState: (data) =>
    set(() => ({ billingAddOnFormModalState: data })),
  finilizeBillingModalState: false,
  setFinilizeBillingModalState: (data) => set(() => ({ finilizeBillingModalState: data })),

  /* Add On */
  addOnModalState: false,
  setAddOnModalState: (data) => set(() => ({ addOnModalState: data })),
  selectedAddOnData: {},
  setSelectedAddOnData: (data) => set(() => ({ selectedAddOnData: data })),


  /* User */
  userFormModalState: false,
  setUserFormModalState: (data) => set(() => ({ userFormModalState: data })),

  /* Promos Form Modal */
  promosFormModalState: false,
  setPromosFormModalState: (data) =>
    set(() => ({ promosFormModalState: data })),
  selectedPromoData: {},
  setSelectedPromoData: (data) => set(() => ({ selectedPromoData: data })),

  /* Manage Guest/User */
  guestFormModalState: false,
  setGuestFormModalState: (data) => set(() => ({ guestFormModalState: data })),
  selectedGuestData: {},
  setSelectedGuestData: (data) => set(() => ({ selectedGuestData: data })),

  /* Filter Options */
  selectedRoomTypeOpt: "",
  setSelectedRoomTypeOpt: (data) => set(() => ({ selectedRoomTypeOpt: data })),
  selectedRoomStatusOpt: "",
  setSelectedRoomStatusOpt: (data) =>
    set(() => ({ selectedRoomStatusOpt: data })),
  reservationFilterRoomTypeOpt: "",
  setReservationFilterRoomTypeOpt: (data) =>
    set(() => ({ reservationFilterRoomTypeOpt: data })),
  reservationFilterStatusOpt: "",
  setReservationFilterStatusOpt: (data) =>
    set(() => ({ reservationFilterStatusOpt: data })),
  addOnFilterType: "",
  setAddOnFilterType: (data) => set(() => ({ addOnFilterType: data })),
  userRoleFilterOpt: "",
  setUserRoleFilterOpt: (data) => set(() => ({ userRoleFilterOpt: data })),
  selectedRoomTypePromosFilter: "",
  setSelectedRoomTypePromosFilter: (data) => set(() => ({ selectedRoomTypePromosFilter: data })),
  selectedBillingStatusFilter: "",
  setSelectedBillingStatusFilter: (data) => set(() => ({ selectedBillingStatusFilter: data })),
  selectedRoomRateRoomTypeFilter: "",
  setSelectedRoomRateRoomTypeFilter: (data: string) => set(() => ({selectedRoomRateRoomTypeFilter: data})),

  // Guest

  guestEditModalState: false,
  setGuestEditModalState: (state: boolean) => set(() => ({ guestEditModalState: state })),
  
  // Reports
  selectedReportRange: { from: new Date("January 1 " + new Date().getFullYear()), to: new Date("December 31 " + new Date().getFullYear) } as DateRange,
  setSelectedReportRange: (range: any) => set(() => ({ selectedReportRange: range })),

  resetSelectOptState: () => {
    set({
      selectedRoomTypePromosFilter: "",
      selectedRoomTypeOpt: "",
      selectedRoomStatusOpt: "",
      reservationFilterRoomTypeOpt: "",
      reservationFilterStatusOpt: "",
      addOnFilterType: "",
      userRoleFilterOpt: "",
      selectedBillingStatusFilter: "",
    });
  },

  // Amenity
  selectedAmenity: [],
  setSelectedAmenity: (amenity: any) => set(() => ({ selectedAmenity: amenity })),
  amenityFormModalState: false,
  setAmenityFormModalState: (state: boolean) => set(() => ({ amenityFormModalState: state })), 

  usersQuery: () => {
    return useQuery({
      queryKey: ["getUsers"],
      queryFn: async () => {
        const res = await getUsers();
        return res.res;
      },
    });
  },
  roomTypeOptionsQuery: () => {
    return useQuery<MainOptions[]>({
      queryKey: ["GetRoomTypeOptions"],
      queryFn: async () => (await getRoomTypeOptions()).res as MainOptions[],
    });
  },
  roomStatusOptionsQuery: () => {
    return useQuery<MainOptions[]>({
      queryKey: ["GetRoomStatusOptions"],
      queryFn: async () => (await getRoomStatusOptions()).res as MainOptions[],
    });
  },
  roomRateTypesQuery: () => {
    return useQuery({
      queryKey: ["GetRoomRateTypes"],
      queryFn: async () =>
        (await getRoomRateTypeOptions()).res as MainOptions[],
    });
  },
  roomsQuery: () => {
    return useQuery({
      queryKey: ["GetRooms"],
      queryFn: async () => (await getRooms()).res as Room[],
    });
  },
  bedTypeOptionsQuery: () => {
    return useQuery<MainOptions[]>({
      queryKey: ["GetBedTypeOptions"],
      queryFn: async () => (await getBedTypeOptions()).res as MainOptions[],
    });
  },
  roomRatesQuery: () => {
    return useQuery<RoomRate[]>({
      queryKey: ["GetRoomRates"],
      queryFn: async () => (await getRoomRates()).res as RoomRate[],
    });
  },
  reservationQuery: () => {
    return useQuery({
      queryKey: ["GetReservations"],
      queryFn: async () => (await getReservations()).res as Reservation[],
    });
  },
  billingsQuery: () => {
    return useQuery({
      queryKey: ["GetBillings"],
      queryFn: async () => (await getBillings()).res as any,
    });

  },
  addOnQuery: () => {
    return useQuery({
      queryKey: ["GetAddOns"],
      queryFn: async () => {
        return (await getAddOns()).res as any;
      },
    });
  },
  addOnTypeQuery: () => {
    return useQuery({
      queryKey: ["GetAddOnsTypeOpt"],
      queryFn: async () => {
        return (await getAddOnsTypeOpt()).res as any;
      },
    });
  },
  promosQuery: () => {
    return useQuery({
      queryKey: ["GetPromos"],
      queryFn: async () => {
        return (await getPromos()).res as any;
      },
    });
  },
  deviceReservationQuery: () => {
    return useQuery({
      queryKey: ["GetDeviceReservation"],
      queryFn: async () => {
        return (await getDeviceReservation()).res as any;
      },
    });
  },

  guestQuery: () => {
    return useQuery({
      queryKey: ["GetGuests"],
      queryFn: async () => {
        return (await getGuests()).res as any;
      }
    })
  },

  availableRoomsQuery: (to: Date, from: Date) => {
    return useQuery({
      queryKey: ["GetAvailableRooms"],
      queryFn: async () => {
        return (await getAvailableRoomsRPC(to,from)).res as any
      }
    })
  },

  amenityQuery: () => {
    return useQuery({
      queryKey: ["GetAmenities"],
      queryFn: async () => {
        return (await getAmenities()).res as any
      }
    })
  }
}));

interface GlobalState {

  /* Company Info */
  companyName: string,
  setCompanyName: (name: string) => void,

  // General
  imageUploadMaxMB: number,
  setImageUploadMaxMB: (value: number) => void

  localeFns: { [key: string]: Locale };
  /*  RoomForm States */
  roomFormModalState: boolean;
  setRoomFormModalState: (state: boolean) => void;
  selectedRoomData: any;
  setSelectedRoomData: (room: any) => void;
  /*RoomRates States */
  rateFormModalState: boolean;
  setRateFormModalState: (state: boolean) => void;
  selectedRateData: any;
  setSelectedRateData: (room: any) => void;

  // Available Rooms
  availableRoomsDateSelect: DateRange;
  setAvailableRoomsDateSelect: (data: DateRange) => void;

  /* Reservation */
  reservationFormModalState: boolean;
  setReservationFormModalState: (state: boolean) => void;
  selectedReservationData: Reservation;
  setSelectedReservationData: (data: Reservation) => void;

  /* Billing */
  billingFormModalState: boolean;
  setBillingFormModalState: (state: boolean) => void;
  billingAddOnFormModalState: boolean;
  setBillingAddOnFormModalState: (data: boolean) => void;
  selectedBillingData: any;
  setSelectedBillingData: (data: any) => void;
  finilizeBillingModalState: boolean;
  setFinilizeBillingModalState: (data: boolean) => void;

  /* Add On */
  addOnModalState: boolean;
  setAddOnModalState: (data: boolean) => void;
  selectedAddOnData: any;
  setSelectedAddOnData: (data: any) => void;

  /* User */
  userFormModalState: boolean;
  setUserFormModalState: (state: boolean) => void;

  /* Promos  */
  promosFormModalState: boolean;
  setPromosFormModalState: (state: boolean) => void;
  selectedPromoData: any;
  setSelectedPromoData: (data: any) => void;
  addOnFilterType: string;
  setAddOnFilterType: (data: string) => void;

  /* Billing Details */

  /* Report */
  selectedReportRange: any
  setSelectedReportRange: (data: any) => void

  /* Queries */
  /* Room */
  usersQuery: () => any;
  roomTypeOptionsQuery: () => any;
  roomStatusOptionsQuery: () => any;
  bedTypeOptionsQuery: () => any;
  roomsQuery: () => any;
  roomRatesQuery: () => any;
  roomRateTypesQuery: () => any;
  billingsQuery: () => any;
  addOnTypeQuery: () => any;
  addOnQuery: () => any;
  reservationQuery: () => any;
  promosQuery: () => any;
  deviceReservationQuery: () => any;
  availableRoomsQuery:(to: Date, from: Date)  => any;

  /* Filters */
  selectedRoomTypeOpt: string;
  setSelectedRoomTypeOpt: (data: string) => void;
  selectedRoomStatusOpt: string;
  setSelectedRoomStatusOpt: (data: string) => void;
  reservationFilterRoomTypeOpt: string;
  setReservationFilterRoomTypeOpt: (data: string) => void;
  reservationFilterStatusOpt: string;
  setReservationFilterStatusOpt: (data: string) => void;
  userRoleFilterOpt: string;
  selectedRoomTypePromosFilter: string;
  selectedRoomRateRoomTypeFilter: string;
  setSelectedRoomRateRoomTypeFilter: (data: string) => void;
  setSelectedRoomTypePromosFilter: (data: string) => void;
  selectedBillingStatusFilter: string;
  setSelectedBillingStatusFilter: (data: string) => void;
  setUserRoleFilterOpt: (data: string) => void;
  resetSelectOptState: () => void;

  // Guest
  guestFormModalState: boolean;
  setGuestFormModalState: (state: boolean) => void;
  selectedGuestData: any;
  setSelectedGuestData: (data: any) => void;
  guestQuery: () => any;
  guestEditModalState: boolean;
  setGuestEditModalState: (state: boolean) => void

  // Amenities
  selectedAmenity: any;
  setSelectedAmenity: (data: any) => void;
  amenityFormModalState: boolean;
  setAmenityFormModalState: (state: boolean) => void;
  amenityQuery: () => any
}


