"use client";

import { BillingModal } from "./shared/BillingModal";
import { useManageTaxRates } from "../../hooks/useManageTaxRates";
import { ManageTaxRatesHeader } from "./ManageTaxRates/ManageTaxRatesHeader";
import { AddTaxRateForm } from "./ManageTaxRates/AddTaxRateForm";
import { TaxRateList } from "./ManageTaxRates/TaxRateList";
import { ManageTaxRatesFooter } from "./ManageTaxRates/ManageTaxRatesFooter";

interface ManageTaxRatesModalProps {

  isOpen: boolean;
  onClose: () => void;
}

export function ManageTaxRatesModal({
  isOpen,
  onClose,
}: ManageTaxRatesModalProps) {
  const {
    taxRates,
    isAdding,
    setIsAdding,
    setEditingId,
    newTaxRate,
    setNewTaxRate,
    handleAddTaxRate,
    handleDeleteTaxRate,
    handleToggleActive,
  } = useManageTaxRates();

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl max-h-[85vh]"
    >
      <ManageTaxRatesHeader isAdding={isAdding} setIsAdding={setIsAdding} />

      <div className="p-6 space-y-4 overflow-y-auto flex-1">
        <AddTaxRateForm
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          newTaxRate={newTaxRate}
          setNewTaxRate={setNewTaxRate}
          handleAddTaxRate={handleAddTaxRate}
        />

        <TaxRateList
          taxRates={taxRates}
          setEditingId={setEditingId}
          handleDeleteTaxRate={handleDeleteTaxRate}
          handleToggleActive={handleToggleActive}
        />
      </div>

      <ManageTaxRatesFooter taxRatesCount={taxRates.length} onClose={onClose} />
    </BillingModal>

  );
}
