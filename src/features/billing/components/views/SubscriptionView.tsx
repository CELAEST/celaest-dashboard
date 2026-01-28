import React from "react";
import { SubscriptionManager } from "../SubscriptionManager";

export const SubscriptionView = () => {
  return (
    <div className="h-full min-h-0 flex flex-col max-w-5xl mx-auto w-full">
      <SubscriptionManager />
    </div>
  );
};
