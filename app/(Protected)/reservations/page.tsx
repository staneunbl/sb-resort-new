import ReservationController from "./ReservationController";
import ReservationTable from "./ReservationTable";
import BillingFormModal from "./BillingFormModal";
import ReservationModal from "./ReservationModal";
export default function page() {
    return (
        <div >
            {/* <AddReservationModal /> */}
            <ReservationModal />
            <BillingFormModal />
            <ReservationController />
            <ReservationTable />
        </div>
    );
}
