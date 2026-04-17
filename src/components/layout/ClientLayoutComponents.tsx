"use client";

import React from "react";
import dynamic from "next/dynamic";

// These components require 'ssr: false' because they rely on browser APIs 
// (window, document, and various browser-only effects).
// Moving them to this Client Component satisfies Next.js 15+ rules 
// which forbid 'ssr: false' on dynamic imports inside Server Components.

const BackgroundEffects = dynamic(() => import("@/components/ui/BackgroundEffects").then(m => m.BackgroundEffects), { 
  ssr: false,
  loading: () => null 
});

const PopupNotification = dynamic(() => import("@/components/notifications/PopupNotification").then(m => m.PopupNotification), { 
  ssr: false,
  loading: () => null 
});

export function ClientLayoutComponents() {
  return (
    <>
      <BackgroundEffects />
      <PopupNotification />
    </>
  );
}
