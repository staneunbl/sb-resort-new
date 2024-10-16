import ReservationDetails from "../../ReservationDetails";
import ReservationDetailsController from "../../ReservationDetailsController";

export default function page({ params }: { params: { id: string } }) {

  return (
    <div>
        <ReservationDetailsController id={params.id} />
        <ReservationDetails id={params.id} />
    </div>
  );
}
