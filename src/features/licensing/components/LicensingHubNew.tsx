"use client";

// Complete License Engine & Anti-Fraud Sentinel - CELAEST
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Key,
  Shield,
  AlertTriangle,
  Copy,
  CheckCircle,
  MapPin,
  TrendingUp,
  Activity,
  X,
  Plus,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

const PRODUCT_TYPES = [
  { value: "excel-automation", label: "Excel Automation" },
  { value: "python-script", label: "Python Script" },
  { value: "nodejs-api", label: "Node.js API" },
  { value: "macro-suite", label: "Macro Suite" },
  { value: "analytics-dashboard", label: "Analytics Dashboard" },
  { value: "data-connector", label: "Data Connector" },
];

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

  // New License Dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createdKey, setCreatedKey] = useState("");
  const [newLicense, setNewLicense] = useState({
    userId: "user_demo_001",
    productId: "",
    productType: "excel-automation",
    maxIpSlots: 1,
    expiresAt: "",
    tier: "basic",
  });

  // License Detail Dialog
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);

  // Removed API calls for design review with "data quemada"

  const loadData = async () => {
    // Mock refresh
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

  const handleCreateLicense = async () => {
    setCreatedKey(
      "sk_test_mock_key_" + Math.random().toString(36).substring(7),
    );
    toast.success("License created successfully! (Mock)");
    // Mock adding to list
    const newLic: License = {
      id: `lic_${Date.now()}`,
      userId: newLicense.userId,
      productId: newLicense.productId || `product_${Date.now()}`,
      productType: newLicense.productType,
      status: "active",
      maxIpSlots: newLicense.maxIpSlots,
      ipSlotsUsed: 0,
      metadata: { tier: newLicense.tier },
      createdAt: new Date().toISOString(),
    };
    setLicenses([newLic, ...licenses]);

    setNewLicense({
      userId: "user_demo_001",
      productId: "",
      productType: "excel-automation",
      maxIpSlots: 1,
      expiresAt: "",
      tier: "basic",
    });
  };

  const handleChangeStatus = async (licenseId: string, status: string) => {
    setLicenses(
      licenses.map((l) =>
        l.id === licenseId ? { ...l, status: status as License["status"] } : l,
      ),
    );
    if (selectedLicense && selectedLicense.id === licenseId) {
      setSelectedLicense({
        ...selectedLicense,
        status: status as License["status"],
      });
    }
    toast.success("License status updated (Mock)");
  };

  const handleUnbindIp = async () => {
    toast.success("IP unbound successfully (Mock)");
  };

  const loadLicenseDetails = async (licenseId: string) => {
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

  const getStatusBadge = (status: string) => {
    const colors = {
      active: isDark
        ? "bg-green-500/20 text-green-400 border-green-500/30"
        : "bg-green-100 text-green-700 border-green-300",
      expired: isDark
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        : "bg-yellow-100 text-yellow-700 border-yellow-300",
      revoked: isDark
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-red-100 text-red-700 border-red-300",
      pending: isDark
        ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
        : "bg-gray-100 text-gray-700 border-gray-300",
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} border`}>
        {status}
      </Badge>
    );
  };

  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch =
      lic.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lic.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1
            className={`text-3xl font-bold mb-2 flex items-center gap-3 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            <Shield
              className={isDark ? "text-cyan-400" : "text-blue-600"}
              size={32}
            />
            License Engine & Anti-Fraud Sentinel
          </h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage API keys, monitor IP bindings, and detect fraudulent usage
          </p>
        </div>
        <Button
          onClick={() => {
            setCreatedKey("");
            setShowCreateDialog(true);
          }}
          className={`${
            isDark
              ? "bg-cyan-500 hover:bg-cyan-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate New License
        </Button>
      </div>

      {/* Stats Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Total Licenses
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {analytics.total}
                  </p>
                </div>
                <Key
                  className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Active
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {analytics.active}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    IP Collisions
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {collisions.length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Success Rate
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {analytics.validationSuccessRate}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveTab("licenses")}
          variant={activeTab === "licenses" ? "default" : "outline"}
          className={
            activeTab === "licenses"
              ? isDark
                ? "bg-cyan-500 text-white"
                : "bg-blue-600 text-white"
              : isDark
                ? "border-white/10 text-gray-400"
                : "border-gray-300 text-gray-700"
          }
        >
          <Key className="w-4 h-4 mr-2" />
          Licenses
        </Button>
        <Button
          onClick={() => setActiveTab("collisions")}
          variant={activeTab === "collisions" ? "default" : "outline"}
          className={
            activeTab === "collisions"
              ? isDark
                ? "bg-cyan-500 text-white"
                : "bg-blue-600 text-white"
              : isDark
                ? "border-white/10 text-gray-400"
                : "border-gray-300 text-gray-700"
          }
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          IP Collisions ({collisions.length})
        </Button>
        <Button
          onClick={() => setActiveTab("analytics")}
          variant={activeTab === "analytics" ? "default" : "outline"}
          className={
            activeTab === "analytics"
              ? isDark
                ? "bg-cyan-500 text-white"
                : "bg-blue-600 text-white"
              : isDark
                ? "border-white/10 text-gray-400"
                : "border-gray-300 text-gray-700"
          }
        >
          <Activity className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Licenses Tab */}
      {activeTab === "licenses" && (
        <Card
          className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
                  All Licenses
                </CardTitle>
                <CardDescription>
                  Manage license keys and IP bindings
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    placeholder="Search licenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 w-64 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50"}`}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    className={`w-40 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50"}`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadData}
                  className={isDark ? "border-white/10" : ""}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className={`w-8 h-8 border-2 rounded-full ${
                    isDark
                      ? "border-cyan-500 border-t-transparent"
                      : "border-blue-600 border-t-transparent"
                  }`}
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow
                    className={isDark ? "border-white/10" : "border-gray-200"}
                  >
                    <TableHead
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Product
                    </TableHead>
                    <TableHead
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      User ID
                    </TableHead>
                    <TableHead
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Status
                    </TableHead>
                    <TableHead
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      IP Slots
                    </TableHead>
                    <TableHead
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Created
                    </TableHead>
                    <TableHead
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses.map((license) => (
                    <TableRow
                      key={license.id}
                      className={isDark ? "border-white/10" : "border-gray-200"}
                    >
                      <TableCell>
                        <div>
                          <p
                            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {license.productId}
                          </p>
                          <p
                            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                          >
                            {license.productType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`font-mono text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {license.userId.substring(0, 12)}...
                      </TableCell>
                      <TableCell>{getStatusBadge(license.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${
                              (license.ipSlotsUsed || 0) > license.maxIpSlots
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            } border`}
                          >
                            {license.ipSlotsUsed || 0}/{license.maxIpSlots}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {new Date(license.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLicense(license);
                              loadLicenseDetails(license.id);
                            }}
                            className={
                              isDark ? "border-white/10 text-gray-400" : ""
                            }
                          >
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* IP Collisions Tab */}
      {activeTab === "collisions" && (
        <Card
          className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <AlertTriangle className="text-red-500" />
              IP Collision Alerts
            </CardTitle>
            <CardDescription>
              Licenses being used from more IPs than allowed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {collisions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle
                  className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-green-400" : "text-green-600"}`}
                />
                <p
                  className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  No Collisions Detected
                </p>
                <p
                  className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                >
                  All licenses are operating within limits
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {collisions.map((collision) => (
                  <div
                    key={collision.licenseId}
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p
                          className={`font-medium ${isDark ? "text-red-400" : "text-red-700"}`}
                        >
                          {collision.license.productId}
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                        >
                          {collision.ipCount} IPs detected (max:{" "}
                          {collision.license.maxIpSlots})
                        </p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                        COLLISION
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {collision.ips.map((ip: string) => (
                        <Badge
                          key={ip}
                          className={`${isDark ? "bg-white/10 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {ip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Active
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {analytics.active}
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  >
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(analytics.active / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Expired
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {analytics.expired}
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  >
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${(analytics.expired / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Revoked
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {analytics.revoked}
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  >
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(analytics.revoked / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
                By Product Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.byProduct).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {type}
                    </span>
                    <Badge
                      className={`${isDark ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-blue-100 text-blue-700 border-blue-300"} border`}
                    >
                      {count as number}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create License Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent
          className={`max-w-md ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>
              Generate New License
            </DialogTitle>
            <DialogDescription>
              Create a new API key for a product. The key will be shown only
              once.
            </DialogDescription>
          </DialogHeader>

          {createdKey ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border ${isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-300"}`}
              >
                <p
                  className={`text-sm mb-2 ${isDark ? "text-green-400" : "text-green-700"}`}
                >
                  License Key Generated!
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className={`flex-1 px-3 py-2 rounded font-mono text-sm ${isDark ? "bg-black/50 text-white" : "bg-white text-gray-900"}`}
                  >
                    {createdKey}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(createdKey)}
                    className={
                      isDark
                        ? "bg-cyan-500 hover:bg-cyan-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p
                className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-700"}`}
              >
                ⚠️ Save this key now. It won&apos;t be shown again!
              </p>
              <Button
                onClick={() => {
                  setCreatedKey("");
                  setShowCreateDialog(false);
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>User ID</Label>
                <Input
                  value={newLicense.userId}
                  onChange={(e) =>
                    setNewLicense({ ...newLicense, userId: e.target.value })
                  }
                  className={isDark ? "bg-white/5 border-white/10" : ""}
                  placeholder="user_001"
                />
              </div>

              <div>
                <Label>Product ID (Optional)</Label>
                <Input
                  value={newLicense.productId}
                  onChange={(e) =>
                    setNewLicense({ ...newLicense, productId: e.target.value })
                  }
                  className={isDark ? "bg-white/5 border-white/10" : ""}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div>
                <Label>Product Type</Label>
                <Select
                  value={newLicense.productType}
                  onValueChange={(value) =>
                    setNewLicense({ ...newLicense, productType: value })
                  }
                >
                  <SelectTrigger
                    className={isDark ? "bg-white/5 border-white/10" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Max IP Slots</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={newLicense.maxIpSlots}
                  onChange={(e) =>
                    setNewLicense({
                      ...newLicense,
                      maxIpSlots: parseInt(e.target.value) || 1,
                    })
                  }
                  className={isDark ? "bg-white/5 border-white/10" : ""}
                />
              </div>

              <div>
                <Label>Tier</Label>
                <Select
                  value={newLicense.tier}
                  onValueChange={(value) =>
                    setNewLicense({ ...newLicense, tier: value })
                  }
                >
                  <SelectTrigger
                    className={isDark ? "bg-white/5 border-white/10" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expiration Date (Optional)</Label>
                <Input
                  type="date"
                  value={newLicense.expiresAt}
                  onChange={(e) =>
                    setNewLicense({ ...newLicense, expiresAt: e.target.value })
                  }
                  className={isDark ? "bg-white/5 border-white/10" : ""}
                />
              </div>

              <Button
                onClick={handleCreateLicense}
                className={`w-full ${isDark ? "bg-cyan-500 hover:bg-cyan-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                Generate License Key
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* License Detail Dialog */}
      <Dialog
        open={!!selectedLicense}
        onOpenChange={() => setSelectedLicense(null)}
      >
        <DialogContent
          className={`max-w-2xl ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>
              License Details
            </DialogTitle>
          </DialogHeader>

          {selectedLicense && (
            <div className="space-y-4">
              {/* License Info */}
              <div
                className={`p-4 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                    >
                      Product ID
                    </p>
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {selectedLicense.productId}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                    >
                      Status
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(selectedLicense.status)}
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                    >
                      User ID
                    </p>
                    <p
                      className={`font-mono text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {selectedLicense.userId}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                    >
                      Created
                    </p>
                    <p
                      className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {new Date(selectedLicense.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Status */}
              <div>
                <Label>Change Status</Label>
                <div className="flex gap-2 mt-2">
                  {["active", "expired", "revoked"].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleChangeStatus(selectedLicense.id, status)
                      }
                      className={
                        selectedLicense.status === status
                          ? isDark
                            ? "border-cyan-500 text-cyan-400"
                            : "border-blue-500 text-blue-600"
                          : ""
                      }
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* IP Bindings */}
              <div>
                <h3
                  className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  IP Bindings ({selectedLicense.ipBindings?.length || 0}/
                  {selectedLicense.maxIpSlots})
                </h3>
                {selectedLicense.ipBindings &&
                selectedLicense.ipBindings.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLicense.ipBindings.map((binding) => (
                      <div
                        key={binding.ip}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {binding.ip}
                          </p>
                          <p
                            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                          >
                            {binding.requestCount} requests • Last seen{" "}
                            {new Date(binding.lastSeenAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnbindIp()}
                          className={
                            isDark
                              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                              : "border-red-300 text-red-600"
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    No IP bindings yet
                  </p>
                )}
              </div>

              {/* Validation Logs */}
              <div>
                <h3
                  className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Recent Validations (Last 10)
                </h3>
                <div
                  className={`max-h-60 overflow-y-auto space-y-1 ${isDark ? "" : ""}`}
                >
                  {validationLogs.slice(0, 10).map((log, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded text-xs font-mono ${
                        log.success
                          ? isDark
                            ? "bg-green-500/10 text-green-400"
                            : "bg-green-50 text-green-700"
                          : isDark
                            ? "bg-red-500/10 text-red-400"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {new Date(log.timestamp).toLocaleTimeString()} • {log.ip}{" "}
                      • {log.reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
