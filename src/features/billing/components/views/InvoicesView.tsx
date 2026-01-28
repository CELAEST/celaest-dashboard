import React from "react";
import { InvoiceHistory } from "../InvoiceHistory";

export const InvoicesView = () => {
  return (
    <div className="h-full min-h-0 flex flex-col pt-0">
      <InvoiceHistory />
    </div>
  );
};
