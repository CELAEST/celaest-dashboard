import React from "react";
import { PaymentMethodsCard } from "../PaymentMethodsCard";

export const PaymentMethodsView = () => {
  return (
    <div className="h-full min-h-0 flex flex-col max-w-4xl mx-auto w-full">
      <PaymentMethodsCard />
    </div>
  );
};
