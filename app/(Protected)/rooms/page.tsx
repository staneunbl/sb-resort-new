import RoomFormModal from "./RoomFormModal";
import RoomTable from "./RoomTable";
import RoomTableController from "./RoomTableController";

export default function page() {
    return (
        <div className="flex w-full flex-col">
            <RoomFormModal />
            <RoomTableController />
            <RoomTable />
        </div>
    );
}
