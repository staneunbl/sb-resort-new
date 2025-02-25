"use client";
import AmenitiesController from "./AmenitiesController";
import { AmenitiesModal } from "./AmenitiesModal";
import { AmenitiesTable } from "./AmenitiesTable";

export default function page() {
    return (
        <div className="p-4">
            <AmenitiesController />
            <AmenitiesModal />
            <AmenitiesTable />
        </div>
    )
}