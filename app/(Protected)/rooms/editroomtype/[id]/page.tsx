"use client";
import RoomTypeForm from "../../RoomTypeForm";
export default function page({ params }: { params: { id: string } }) {
    return (
        <div className="flex flex-col">
            <div className="w-full border-b border-cstm-secondary p-4 text-2xl font-semibold">
                <h1>Edit Room:{params.id}</h1>
            </div>
            <RoomTypeForm id={params.id} />
        </div>
    );
}
