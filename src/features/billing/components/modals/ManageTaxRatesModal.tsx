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
    editingId,
    newTaxRate,
    setNewTaxRate,
    handleAddTaxRate,
    handleDeleteTaxRate,
    handleToggleActive,
    handleSaveEdit,
    startEditing,
  } = useManageTaxRates();

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl max-h-[85vh]"
      showCloseButton={false}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <ManageTaxRatesHeader isAdding={isAdding} setIsAdding={setIsAdding} onClose={onClose} />

      <div className="px-8 py-6 space-y-4 overflow-y-auto flex-1 min-h-0">
        <AddTaxRateForm
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          editingId={editingId}
          newTaxRate={newTaxRate}
          setNewTaxRate={setNewTaxRate}
          handleAddTaxRate={handleAddTaxRate}
          handleSaveEdit={handleSaveEdit}
        />

        <TaxRateList
          taxRates={taxRates}
          startEditing={startEditing}
          handleDeleteTaxRate={handleDeleteTaxRate}
          handleToggleActive={handleToggleActive}
        />
      </div>

      <ManageTaxRatesFooter taxRatesCount={taxRates.length} onClose={onClose} />
    </BillingModal>
  );
}
