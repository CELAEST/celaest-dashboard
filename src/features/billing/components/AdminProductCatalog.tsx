import React, { useState } from "react";
import { Asset } from "@/features/assets/services/assets.service";
import { Plan } from "@/features/billing/types";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/features/billing/api/billing.api";
import { AdminPlanModal } from "./AdminPlanModal";
import { AdminProductModal } from "./AdminProductModal";
import { Plus, Package, CreditCard, PencilSimple, CircleNotch } from "@phosphor-icons/react";
import { assetsService } from "@/features/assets/services/assets.service";

export const AdminProductCatalog: React.FC = () => {
  const { session } = useAuth();
  const token = session?.accessToken || "";
  const [activeTab, setActiveTab] = useState<"products" | "plans">("plans");

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Asset | null>(null);

  // Fetch plans globally
  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: () => billingApi.getPlans("system", token, false), // using 'system' or dummy orgId to fetch all global plans
    enabled: !!token,
  });

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => assetsService.fetchAllProducts(token),
    enabled: !!token,
  });

  const plans = plansData?.plans || [];
  const products = productsData || [];

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex bg-gray-100 dark:bg-black/40 dark:backdrop-blur-xl p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "products"
                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <Package
              size={16}
              className={activeTab === "products" ? "text-cyan-500" : ""}
            />
            Products (Assets)
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "plans"
                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <CreditCard
              size={16}
              className={activeTab === "plans" ? "text-cyan-500" : ""}
            />
            Subscription Plans
          </button>
        </div>

        <button
          onClick={() => {
            if (activeTab === "plans") {
              setSelectedPlan(null);
              setIsPlanModalOpen(true);
            } else {
              setSelectedProduct(null);
              setIsProductModalOpen(true);
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 border border-white/10"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Create {activeTab === "products" ? "Product" : "Plan"}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="rounded-2xl border overflow-hidden bg-white dark:bg-black/20 dark:backdrop-blur-2xl border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
        {activeTab === "plans" ? (
          isLoadingPlans ? (
            <div className="flex justify-center p-12">
              <CircleNotch className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center p-12 text-gray-400 text-sm">
              No plans found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/10 border-b">
                  <tr>
                    <th className="px-6 py-4">Plan Name</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Monthly</th>
                    <th className="px-6 py-4">Yearly</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {plans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      <td className="px-6 py-4 text-cyan-600 dark:text-cyan-400 font-bold tracking-wide">
                        {plan.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs opacity-70">
                        {plan.code}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className="opacity-50">$</span>
                        {plan.price_monthly?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className="opacity-50">$</span>
                        {plan.price_yearly?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${plan.is_active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                        >
                          {plan.is_active ? "Active" : "Archived"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-400 hover:text-cyan-500 hover:border-cyan-500/30 transition-all shadow-sm"
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsPlanModalOpen(true);
                            }}
                          >
                            <PencilSimple size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            {isLoadingProducts ? (
              <div className="flex justify-center p-12">
                <CircleNotch className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-12 text-gray-400 text-sm">
                No global products found.
              </div>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/10 border-b">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {products.map((prod) => (
                    <tr
                      key={prod.id}
                      className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-bold tracking-wide dark:text-white">
                        {prod.name}
                      </td>
                      <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 opacity-80">
                        {prod.category}
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="opacity-50">$</span>
                        {prod.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${prod.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-400 hover:text-cyan-500 hover:border-cyan-500/30 transition-all shadow-sm"
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsProductModalOpen(true);
                            }}
                          >
                            <PencilSimple size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <AdminPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={selectedPlan}
        token={token}
      />
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        orgId="system"
        token={token}
      />
    </div>
  );
};
