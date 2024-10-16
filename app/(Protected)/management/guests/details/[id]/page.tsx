import GuestDetails from "../../GuestDetails";
import GuestDetailsController from "../../GuestDetailsController";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <GuestDetailsController id={params.id} />
      <GuestDetails id={params.id} />
    </div>
  );
}
