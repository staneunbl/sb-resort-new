import BillingAddOnForm from "./BillingAddOnForm";
import BillingsController from "./BillingsController";
import BillingsTable from "./BillingsTable";
import FinalizeBillingForm from "./FinalizeBillingForm";

export default function page() {
  return (
    <div>
      <FinalizeBillingForm />
      <BillingAddOnForm />
      <BillingsController />
      <BillingsTable />
    </div>
  );
}
