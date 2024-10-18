"use client";
import { AmenitiesModal } from "./AmenitiesModal";
import { AmenitiesTable } from "./AmenitiesTable";

export default function page() {
    return (
        <div className="p-4">
            <AmenitiesModal />
            <AmenitiesTable />
        </div>
    )
}