import PromosController from "./PromosController";
import PromosModal from "./PromosModal";
import PromosTable from "./PromosTable";

export default function page() {
  return (
    <div>
      <PromosModal />
      <PromosController />
      <PromosTable />
    </div>
  );
}
