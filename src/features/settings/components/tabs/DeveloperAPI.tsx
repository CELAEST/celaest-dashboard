"use client";

import React from "react";
import { useDeveloperSettings } from "../../hooks/useDeveloperSettings";
import { ApiKeys } from "./DeveloperAPI/ApiKeys";
import { Webhooks } from "./DeveloperAPI/Webhooks";
import { ApiDocs } from "./DeveloperAPI/ApiDocs";
import { ApiSecurityAlert } from "./DeveloperAPI/ApiSecurityAlert";

/**
 * Developer & API Settings Tab
 */
export function DeveloperAPI() {
  const { apiKeys, copyToClipboard, generateKey } = useDeveloperSettings();

  return (
    <div className="space-y-6 pb-8">
      <ApiKeys
        apiKeys={apiKeys}
        onGenerate={generateKey}
        onCopy={copyToClipboard}
      />
      <Webhooks />
      <ApiDocs />
      <ApiSecurityAlert />
    </div>
  );
}
