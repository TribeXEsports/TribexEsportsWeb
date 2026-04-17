"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SiteSettings {
  cloudinaryCloudName: string | null;
  cloudinaryUploadPreset: string | null;
  [key: string]: any;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  updateSettings: (newSettings: SiteSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ 
  children, 
  initialSettings 
}: { 
  children: ReactNode; 
  initialSettings: SiteSettings | null;
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
