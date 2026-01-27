import React, { memo } from "react";
import { SettingsTabButton } from "./SettingsTabButton";
import { SettingsTab, SettingsTabId } from "./types";

interface SettingsTabsNavigationProps {
  tabs: SettingsTab[];
  activeTab: SettingsTabId;
  onTabChange: (id: SettingsTabId) => void;
}

export const SettingsTabsNavigation: React.FC<SettingsTabsNavigationProps> =
  memo(({ tabs, activeTab, onTabChange }) => {
    return (
      <div className="flex items-center gap-1 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <SettingsTabButton
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id as SettingsTabId)}
          />
        ))}
      </div>
    );
  });

SettingsTabsNavigation.displayName = "SettingsTabsNavigation";
