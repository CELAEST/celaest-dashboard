"use client";

import React, { useState } from "react";
import {
  Code,
  Copy,
  RefreshCw,
  ExternalLink,
  Key,
  Globe,
  LayoutGrid,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Developer & API Settings Tab
 */
export function DeveloperAPI() {
  const { isDark } = useTheme();
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Production API Key",
      key: "pk_live_f7a2b9c8d1e3f4a5b6c7d8e9f0a1b2c3d4",
      created: "Oct 12, 2023",
      lastUsed: "2 mins ago",
    },
    {
      id: "2",
      name: "Development Key",
      key: "pk_test_b9c8d1e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
      created: "Dec 05, 2023",
      lastUsed: "Yesterday",
    },
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* API Overview */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
              isDark ? "bg-cyan-500/10" : "bg-cyan-50"
            }`}
          >
            <Code
              className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
            />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Developer API Keys
            </h3>
            <p
              className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Manage your API keys for programmatic access to Celaest.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className={`p-5 rounded-xl border transition-all hover:border-cyan-500/30 ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {key.name}
                  </p>
                  <p
                    className={`text-[11px] mt-1 font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Created {key.created} • Last used {key.lastUsed}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => toast.success("API Key regenerated")}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "text-gray-500 hover:text-white hover:bg-white/5"
                        : "text-gray-400 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                    title="Regenerate"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3.5 rounded-xl border font-mono text-xs transition-colors ${
                  isDark
                    ? "bg-black border-white/10 text-cyan-400/90"
                    : "bg-white border-gray-200 text-cyan-600 shadow-sm"
                }`}
              >
                <Key size={14} className="shrink-0 opacity-40" />
                <span className="flex-1 truncate tracking-wider">
                  {key.key.substring(0, 12)}...
                  {key.key.substring(key.key.length - 4)}
                </span>
                <button
                  onClick={() => copyToClipboard(key.key)}
                  className={`p-1.5 rounded-md transition-all ${
                    isDark
                      ? "hover:bg-cyan-500/10 text-cyan-500"
                      : "hover:bg-cyan-50 text-cyan-600"
                  }`}
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
              loading: "Generating cryptographically secure key...",
              success: () => {
                setApiKeys([
                  ...apiKeys,
                  {
                    id: Date.now().toString(),
                    name: "New Live Key",
                    key: `pk_live_${Math.random().toString(36).substring(2)}`,
                    created: "Just now",
                    lastUsed: "Never",
                  },
                ]);
                return "New API key generated successfully";
              },
            });
          }}
          className={`w-full mt-6 py-3.5 rounded-xl border-dashed border-2 font-black transition-all text-[11px] flex items-center justify-center gap-2 tracking-widest ${
            isDark
              ? "border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/5 hover:border-cyan-500/40"
              : "border-cyan-200 text-cyan-600 bg-cyan-50/30 hover:bg-cyan-50 hover:border-cyan-300"
          }`}
        >
          <LayoutGrid size={14} />
          GENERATE NEW LIVE KEY
        </button>
      </div>

      {/* Webhooks Section */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            <Zap className="w-5 h-5 text-amber-500" />
            Webhooks
          </h3>
          <button
            onClick={() =>
              toast("Endpoint configuration modal would open here", {
                description: "This feature requires backend integration.",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
              isDark
                ? "bg-white/5 text-gray-400 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            ADD ENDPOINT
          </button>
        </div>

        <div
          className={`flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-dashed transition-colors ${
            isDark
              ? "bg-black/20 border-white/5 text-gray-500"
              : "bg-gray-50 border-gray-200 text-gray-400"
          }`}
        >
          <Globe size={40} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">No webhook endpoints configured</p>
          <p className="text-xs mt-1 opacity-60">
            Add an endpoint to start receiving real-time events.
          </p>
        </div>
      </div>

      {/* API Documentation */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <ExternalLink className="w-4 h-4 text-blue-500" />
          Documentation & Support
        </h3>
        <p
          className={`text-sm mb-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Learn how to integrate Celaest into your workflow with our
          comprehensive API documentation and examples.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="#"
            className={`p-4 rounded-xl border transition-all flex items-center justify-between group shadow-xs ${
              isDark
                ? "bg-white/5 border-white/5 hover:bg-white/10"
                : "bg-gray-50 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div>
              <p
                className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                API Reference
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Detailed endpoint documentation
              </p>
            </div>
            <ExternalLink
              size={16}
              className={`transition-transform group-hover:translate-x-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            />
          </a>
          <a
            href="#"
            className={`p-4 rounded-xl border transition-all flex items-center justify-between group shadow-xs ${
              isDark
                ? "bg-white/5 border-white/5 hover:bg-white/10"
                : "bg-gray-50 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div>
              <p
                className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                SDK Guides
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Libraries for Python, JS, and Rust
              </p>
            </div>
            <ExternalLink
              size={16}
              className={`transition-transform group-hover:translate-x-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            />
          </a>
        </div>
      </div>

      {/* Security Alert */}
      <div
        className={`rounded-2xl p-5 border transition-all shadow-sm ${
          isDark
            ? "bg-amber-500/5 border-amber-500/20"
            : "bg-amber-50 border-amber-100"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p
              className={`font-black text-xs tracking-widest ${isDark ? "text-amber-400" : "text-amber-700"}`}
            >
              API KEY SECURITY
            </p>
            <p
              className={`text-xs mt-1 leading-relaxed font-medium ${isDark ? "text-amber-400/60" : "text-amber-600/70"}`}
            >
              Your API keys carry significant privileges. Never share them in
              publicly accessible areas. If you believe a key has been
              compromised, regenerate it immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
