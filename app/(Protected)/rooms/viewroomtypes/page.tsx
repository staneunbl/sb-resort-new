import RoomTypeTable from "../RoomTypeTable";
import TableController from "../RoomTypeController";
import RoomTypeController from "../RoomTypeController";

export default function page() {
    return (
        <div className="flex w-full flex-col gap-4">
            <RoomTypeController />
            <RoomTypeTable />
        </div>
    );
}
