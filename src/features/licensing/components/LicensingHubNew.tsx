"use client";

// Complete License Engine & Anti-Fraud Sentinel - CELAEST
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CreateLicenseModal } from "./modals/CreateLicenseModal";
import { LicenseDetailsModal } from "./modals/LicenseDetailsModal";

import {
  Key,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface License {
  id: string;
  key?: string; // Hashed in DB, only shown on creation
  userId: string;
  productId: string;
  productType: string;
  status: "active" | "expired" | "revoked" | "pending";
  maxIpSlots: number;
  ipBindings?: IpBinding[];
  ipSlotsUsed?: number;
  metadata: {
    expiresAt?: string;
    maxUsageCount?: number;
    currentUsageCount?: number;
    tier?: string;
    notes?: string;
  };
  createdAt: string;
  lastValidatedAt?: string;
}

interface IpBinding {
  licenseId: string;
  ip: string;
  firstSeenAt: string;
  lastSeenAt: string;
  requestCount: number;
  userAgent?: string;
}

interface ValidationLog {
  licenseId: string;
  ip: string;
  timestamp: string;
  success: boolean;
  reason?: string;
}

// End of imports

const MOCK_LICENSES: License[] = [
  {
    id: "lic_1",
    userId: "user_demo_001",
    productId: "excel-automation-pro",
    productType: "excel-automation",
    status: "active",
    maxIpSlots: 3,
    ipSlotsUsed: 1,
    ipBindings: [
      {
        licenseId: "lic_1",
        ip: "192.168.1.10",
        firstSeenAt: "2025-01-01",
        lastSeenAt: "2026-01-26",
        requestCount: 150,
      },
    ],
    metadata: { tier: "pro" },
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "lic_2",
    userId: "user_sales_05",
    productId: "data-connector-ent",
    productType: "data-connector",
    status: "active",
    maxIpSlots: 10,
    ipSlotsUsed: 2,
    metadata: { tier: "enterprise" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "lic_3",
    userId: "dev_team_alpha",
    productId: "nodejs-api-dev",
    productType: "nodejs-api",
    status: "expired",
    maxIpSlots: 5,
    ipSlotsUsed: 5,
    metadata: { tier: "basic", expiresAt: "2025-12-31" },
    createdAt: "2024-06-01T10:00:00Z",
  },
];

const MOCK_ANALYTICS = {
  total: 150,
  active: 120,
  expired: 20,
  revoked: 10,
  validationSuccessRate: 98.5,
  byProduct: {
    "excel-automation": 50,
    "python-script": 30,
    "nodejs-api": 40,
    "data-connector": 30,
  },
};

const MOCK_COLLISIONS: Collision[] = [
  {
    licenseId: "lic_55",
    ipCount: 4,
    license: { productId: "macro-suite-basic", maxIpSlots: 1 },
    ips: ["10.0.0.1", "10.0.0.2", "192.168.1.5", "172.16.0.1"],
  },
];

interface Analytics {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  validationSuccessRate: number;
  byProduct: Record<string, number>;
}

interface Collision {
  licenseId: string;
  ipCount: number;
  license: { productId: string; maxIpSlots: number };
  ips: string[];
}

export const LicensingHubNew: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [analytics, setAnalytics] = useState<Analytics | null>(MOCK_ANALYTICS);
  const [collisions, setCollisions] = useState<Collision[]>(MOCK_COLLISIONS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "licenses" | "collisions" | "analytics"
  >("licenses");

  // New License Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // License Detail Modal State
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);

  const loadData = async () => {
    // Mock refresh logic
    setLoading(true);
    setTimeout(() => {
      setLicenses(MOCK_LICENSES);
      setAnalytics(MOCK_ANALYTICS);
      setCollisions(MOCK_COLLISIONS);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Avoid synchronous setState warning by deferring
    const timeout = setTimeout(loadData, 0);
    const interval = setInterval(loadData, 10000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const handleCreateLicense = async (newLicenseData: {
    userId: string;
    productId?: string;
    productType: string;
    maxIpSlots: number;
    tier: string;
    expiresAt?: string;
  }) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const newKey =
          "sk_test_mock_key_" + Math.random().toString(36).substring(7);
        const newLic: License = {
          id: `lic_${Date.now()}`,
          userId: newLicenseData.userId,
          productId: newLicenseData.productId || `product_${Date.now()}`, // simplified for demo
          productType: newLicenseData.productType,
          status: "active",
          maxIpSlots: newLicenseData.maxIpSlots,
          ipSlotsUsed: 0,
          metadata: {
            tier: newLicenseData.tier,
            expiresAt: newLicenseData.expiresAt,
          },
          createdAt: new Date().toISOString(),
        };
        setLicenses([newLic, ...licenses]);
        toast.success("License created successfully! (Mock)");
        resolve(newKey);
      }, 1500); // Simulate network delay
    });
  };

  const handleChangeStatus = async (status: string) => {
    if (!selectedLicense) return;
    const licenseId = selectedLicense.id;

    setLicenses(
      licenses.map((l) =>
        l.id === licenseId ? { ...l, status: status as License["status"] } : l,
      ),
    );
    // Update selected license local state to reflect change immediately in modal
    setSelectedLicense({
      ...selectedLicense,
      status: status as License["status"],
    });
    toast.success(`License status updated to ${status} (Mock)`);
  };

  const handleUnbindIp = async (ip: string) => {
    // Mock unbind
    if (!selectedLicense) return;
    const updatedBindings =
      selectedLicense.ipBindings?.filter((b) => b.ip !== ip) || [];

    const updatedLicense = { ...selectedLicense, ipBindings: updatedBindings };
    setSelectedLicense(updatedLicense);

    setLicenses(
      licenses.map((l) => (l.id === selectedLicense.id ? updatedLicense : l)),
    );
    toast.success(`IP ${ip} unbound successfully (Mock)`);
  };

  const loadLicenseDetails = async (licenseId: string) => {
    // Mock loading logs
    setValidationLogs([
      {
        licenseId,
        ip: "192.168.1.1",
        timestamp: new Date().toISOString(),
        success: true,
      },
      {
        licenseId,
        ip: "10.0.0.5",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        success: true,
      },
      {
        licenseId,
        ip: "172.16.0.1",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        success: false,
        reason: "Invalid signature",
      },
    ]);
  };

  // Helper for filtered licenses
  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch =
      lic.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lic.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-[#050505]" : "bg-gray-50/50"}`}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold mb-2 flex items-center gap-3 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            <div
              className={`p-2 rounded-xl ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-600/10 text-blue-600"}`}
            >
              <Shield size={28} />
            </div>
            License Engine
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-600"} max-w-xl`}
          >
            Enterprise-grade license management with real-time fraud detection
            and instant provisioning.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className={`h-12 px-6 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all ${
            isDark
              ? "bg-cyan-500 hover:bg-cyan-400 text-black"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate New License
        </Button>
      </div>

      {/* Stats Cards - Premium Redesign */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Licenses",
              value: analytics.total,
              icon: Key,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Active Now",
              value: analytics.active,
              icon: CheckCircle,
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              label: "IP Collisions",
              value: collisions.length,
              icon: AlertTriangle,
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
            {
              label: "Success Rate",
              value: `${analytics.validationSuccessRate}%`,
              icon: TrendingUp,
              color: "text-cyan-500",
              bg: "bg-cyan-500/10",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border backdrop-blur-sm ${
                isDark
                  ? "bg-white/5 border-white/5 hover:bg-white/10"
                  : "bg-white border-gray-100 hover:border-gray-200"
              } transition-colors`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                {i === 3 && (
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded-full ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}
                  >
                    +2.4%
                  </div>
                )}
              </div>
              <div
                className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {stat.value}
              </div>
              <div
                className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <Card
        className={`overflow-hidden border-0 shadow-xl ${isDark ? "bg-[#0a0a0a]/50 ring-1 ring-white/10" : "bg-white ring-1 ring-gray-100"}`}
      >
        {/* Tabs Header */}
        <div
          className={`px-6 pt-6 pb-0 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}
        >
          <div className="flex items-center gap-8">
            {[
              { id: "licenses", label: "License Keys", icon: Key },
              {
                id: "collisions",
                label: `Collisions (${collisions.length})`,
                icon: AlertTriangle,
              },
              { id: "analytics", label: "Analytics", icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as "licenses" | "collisions" | "analytics",
                  )
                }
                className={`pb-4 text-sm font-medium flex items-center gap-2 relative transition-colors ${
                  activeTab === tab.id
                    ? isDark
                      ? "text-cyan-400"
                      : "text-blue-600"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-blue-600"}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "licenses" && (
            <>
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                <div className="relative max-w-md w-full">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <Input
                    placeholder="Search by Product ID, User ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 h-10 ${isDark ? "bg-white/5 border-white/10 focus:border-cyan-500/40" : "bg-gray-50 border-gray-200"}`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger
                      className={`w-40 h-10 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
                    >
                      <div className="flex items-center gap-2">
                        <Filter size={14} />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="revoked">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={loadData}
                    className={`h-10 w-10 ${isDark ? "border-white/10 hover:bg-white/5" : ""}`}
                  >
                    <RefreshCw
                      className={loading ? "animate-spin" : ""}
                      size={16}
                    />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div
                className={`rounded-xl border overflow-hidden ${isDark ? "border-white/5" : "border-gray-100"}`}
              >
                <Table>
                  <TableHeader className={isDark ? "bg-white/5" : "bg-gray-50"}>
                    <TableRow
                      className={`hover:bg-transparent ${isDark ? "border-white/5" : "border-gray-100"}`}
                    >
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">User ID</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">IP Usage</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLicenses.map((license) => (
                      <TableRow
                        key={license.id}
                        className={`group cursor-pointer transition-colors ${
                          isDark
                            ? "hover:bg-white/5 border-white/5"
                            : "hover:bg-gray-50 border-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedLicense(license);
                          loadLicenseDetails(license.id);
                        }}
                      >
                        <TableCell>
                          <div>
                            <div
                              className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {license.productId}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {license.productType.replace("-", " ")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500">
                          {license.userId}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                              license.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : license.status === "expired"
                                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                license.status === "active"
                                  ? "bg-green-500"
                                  : license.status === "expired"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            {license.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex-1 h-1.5 w-24 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-100"}`}
                            >
                              <div
                                className={`h-full rounded-full ${
                                  (license.ipSlotsUsed || 0) /
                                    license.maxIpSlots >
                                  0.8
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${((license.ipSlotsUsed || 0) / license.maxIpSlots) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {license.ipSlotsUsed}/{license.maxIpSlots}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {activeTab === "collisions" && (
            <div className="py-12 text-center text-gray-500">
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Collision monitoring view placeholder</p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="py-12 text-center text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>Advanced analytics view placeholder</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      <CreateLicenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLicense}
      />

      <LicenseDetailsModal
        isOpen={!!selectedLicense}
        onClose={() => setSelectedLicense(null)}
        license={selectedLicense}
        logs={validationLogs}
        onStatusChange={handleChangeStatus}
        onUnbindIp={handleUnbindIp}
      />
    </div>
  );
};
