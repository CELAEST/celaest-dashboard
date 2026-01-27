import { useState } from "react";
import { TaxRate } from "../types";

const INITIAL_RATES: TaxRate[] = [
  {
    id: "1",
    country: "United States",
    code: "US",
    rate: "0",
    vatType: "VAT/VA",
    isActive: true,
  },
  {
    id: "2",
    country: "European Union",
    code: "EU",
    rate: "21",
    vatType: "VAT/VA",
    isActive: true,
  },
  {
    id: "3",
    country: "United Kingdom",
    code: "UK",
    rate: "20",
    vatType: "VAT/VA",
    isActive: true,
  },
  {
    id: "4",
    country: "Canada",
    code: "CA",
    rate: "5",
    vatType: "GST",
    isActive: true,
  },
  {
    id: "5",
    country: "Australia",
    code: "AU",
    rate: "10",
    vatType: "GST",
    isActive: false,
  },
];

export const useManageTaxRates = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(INITIAL_RATES);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTaxRate, setNewTaxRate] = useState<Partial<TaxRate>>({
    country: "",
    code: "",
    rate: "",
    vatType: "VAT",
  });

  const handleAddTaxRate = () => {
    if (newTaxRate.country && newTaxRate.code && newTaxRate.rate) {
      setTaxRates([
        ...taxRates,
        {
          id: Date.now().toString(),
          country: newTaxRate.country || "",
          code: (newTaxRate.code || "").toUpperCase(),
          rate: newTaxRate.rate || "0",
          vatType: newTaxRate.vatType || "VAT",
          isActive: true,
        },
      ]);
      setNewTaxRate({ country: "", code: "", rate: "", vatType: "VAT" });
      setIsAdding(false);
    }
  };

  const handleDeleteTaxRate = (id: string) => {
    setTaxRates(taxRates.filter((rate) => rate.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setTaxRates(
      taxRates.map((rate) =>
        rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
      )
    );
  };

  return {
    taxRates,
    isAdding,
    setIsAdding,
    editingId,
    setEditingId,
    newTaxRate,
    setNewTaxRate,
    handleAddTaxRate,
    handleDeleteTaxRate,
    handleToggleActive,
  };
};
