import { DiscountsController } from "./DiscountsController";
import { DiscountsModal } from "./DiscountsModal";
import { DiscountsTable } from "./DiscountsTable";

export default function Page() {
    return (
        <div>
            <DiscountsModal></DiscountsModal>
            <DiscountsController></DiscountsController>
            <DiscountsTable></DiscountsTable>
        </div>
    )
}