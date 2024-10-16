import React from "react";
import AddOnController from "./AddOnController";
import AddOnTable from "./AddOnTable";
import AddOnFormModal from "./AddOnFormModal";
export default function page() {
  return (
    <div>
      <AddOnController />
      <AddOnTable />
      <AddOnFormModal />
    </div>
  );
}
