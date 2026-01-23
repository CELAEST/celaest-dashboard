"use client";

import React, { useState } from "react";
import {
  Code,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Webhook,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { SettingsModal } from "../SettingsModal";
import type { WebhookEndpoint } from "../../types";

/**
 * Developer & API Settings Tab
 */
export function DeveloperAPI() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [password, setPassword] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "license.created",
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: "1",
      url: "https://api.example.com/webhooks/celaest",
      events: ["license.created", "license.revoked", "payment.success"],
      status: "active",
      lastTriggered: "2 hours ago",
    },
    {
      id: "2",
      url: "https://monitor.acme.com/events",
      events: ["error.critical", "system.down"],
      status: "failed",
      lastTriggered: "5 days ago",
    },
  ]);

  const apiKey = "sk_live_4x9k8j7h6g5f4d3s2a1";

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    setShowRegenerateModal(false);
    setPassword("");
    setApiKeyVisible(false);
  };

  const handleAddWebhook = () => {
    if (newWebhookUrl) {
      const newWebhook: WebhookEndpoint = {
        id: Date.now().toString(),
        url: newWebhookUrl,
        events: selectedEvents,
        status: "active",
      };
      setWebhooks([...webhooks, newWebhook]);
      setNewWebhookUrl("");
      setSelectedEvents(["license.created"]);
      setShowAddWebhookModal(false);
    }
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  const availableEvents = [
    "license.created",
    "license.revoked",
    "payment.success",
    "error.critical",
  ];

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" />
          API Keys
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Live API Key
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg px-4 py-3 font-mono text-sm text-white bg-[#0d0d0d] border border-white/10">
                {apiKeyVisible ? apiKey : "••••••••••••••••••••••••"}
              </div>
              <button
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="p-3 rounded-lg bg-[#0d0d0d] border border-white/10 hover:bg-white/5 transition-colors"
              >
                {apiKeyVisible ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <button
                onClick={handleCopyApiKey}
                className="p-3 rounded-lg bg-[#0d0d0d] border border-white/10 hover:bg-cyan-500/10 transition-colors"
              >
                {apiKeyCopied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-cyan-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/5">
            <div>
              <p className="text-white font-medium text-sm mb-1">
                Regenerate API Key
              </p>
              <p className="text-xs text-gray-500">
                This will invalidate your current key.
              </p>
            </div>
            <button
              onClick={() => setShowRegenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-sm text-red-400 font-medium mb-1">
                Keep Your Key Secure
              </p>
              <p className="text-xs text-gray-500">
                Never expose your API key in client-side code or public
                repositories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          API Documentation
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Use the CELAEST API to programmatically manage licenses, track usage,
          and integrate with your systems.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-transparent border border-cyan-500/50 text-cyan-400 text-sm font-medium hover:bg-cyan-500/10 transition-colors">
            View Documentation
          </button>
          <button className="px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors">
            API Reference
          </button>
        </div>
      </div>

      {/* Webhooks */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-cyan-400" />
            Webhook Endpoints
          </h3>
          <button
            onClick={() => setShowAddWebhookModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Endpoint
          </button>
        </div>

        {webhooks.length > 0 ? (
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-white font-mono text-sm truncate">
                        {webhook.url}
                      </p>
                      {webhook.status === "active" ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                          Failed
                        </span>
                      )}
                    </div>
                    {webhook.lastTriggered && (
                      <p className="text-xs text-gray-500">
                        Last triggered {webhook.lastTriggered}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-400 border border-white/10"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl bg-[#0d0d0d] border border-white/5">
            <Webhook className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No webhook endpoints configured
            </p>
          </div>
        )}
      </div>

      {/* Regenerate API Key Modal */}
      <SettingsModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        title="Regenerate API Key"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />
            <div>
              <p className="text-sm text-orange-400 font-medium mb-1">
                Warning
              </p>
              <p className="text-xs text-gray-400">
                This will immediately invalidate your current API key.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Confirm Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowRegenerateModal(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRegenerateKey}
              disabled={!password}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-orange-500 to-red-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Regenerate Key
            </button>
          </div>
        </div>
      </SettingsModal>

      {/* Add Webhook Modal */}
      <SettingsModal
        isOpen={showAddWebhookModal}
        onClose={() => setShowAddWebhookModal(false)}
        title="Add Webhook Endpoint"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Endpoint URL
            </label>
            <input
              type="url"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 focus:border-cyan-400 focus:outline-none font-mono text-sm"
              placeholder="https://your-domain.com/webhooks"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Events to Subscribe
            </label>
            <div className="space-y-2">
              {availableEvents.map((event) => (
                <label
                  key={event}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0d0d] border border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event)}
                    onChange={() => toggleEvent(event)}
                    className="w-4 h-4 rounded border-gray-600 bg-transparent text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white font-mono">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowAddWebhookModal(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWebhook}
              disabled={!newWebhookUrl}
              className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Endpoint
            </button>
          </div>
        </div>
      </SettingsModal>
    </div>
  );
}
