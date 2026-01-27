import { useState } from "react";
import { PaymentMethod } from "../types";

const INITIAL_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2026",
    isDefault: true,
    holderName: "John Doe",
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: "08",
    expiryYear: "2027",
    isDefault: false,
    holderName: "John Doe",
  },
  {
    id: "3",
    type: "amex",
    last4: "1001",
    expiryMonth: "11",
    expiryYear: "2028",
    isDefault: false,
    holderName: "John Doe",
  },
  {
    id: "4",
    type: "visa",
    last4: "5555",
    expiryMonth: "03",
    expiryYear: "2029",
    isDefault: false,
    holderName: "John Doe",
  },
];

export const usePaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleSetDefault = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault && methods.length > 1) {
      alert(
        "Cannot delete default payment method. Please set another card as default first.",
      );
      return;
    }
    if (methods.length === 1) {
      alert(
        "Cannot delete the only payment method associated with an active subscription.",
      );
      return;
    }
    setMethods(methods.filter((m) => m.id !== id));
    setActiveMenu(null);
  };

  const handleUpdateMethod = (updatedMethod: PaymentMethod) => {
    setMethods(
      methods.map((m) => (m.id === updatedMethod.id ? updatedMethod : m)),
    );
  };

  const addMethod = (newMethod: PaymentMethod) => {
      setMethods([...methods, newMethod]);
  }

  return {
    methods,
    activeMenu,
    setActiveMenu,
    handleSetDefault,
    handleDelete,
    handleUpdateMethod,
    addMethod
  };
};
