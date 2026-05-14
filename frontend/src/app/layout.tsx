import type { ReactNode } from "react";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { fontVars } from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS, PREFERENCE_PERSISTENCE } from "@/lib/preferences/preferences-config";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme-mode={PREFERENCE_DEFAULTS.theme_mode}
      data-theme-preset={PREFERENCE_DEFAULTS.theme_preset}
      data-content-layout={PREFERENCE_DEFAULTS.content_layout}
      data-navbar-style={PREFERENCE_DEFAULTS.navbar_style}
      data-sidebar-variant={PREFERENCE_DEFAULTS.sidebar_variant}
      data-sidebar-collapsible={PREFERENCE_DEFAULTS.sidebar_collapsible}
      data-font={PREFERENCE_DEFAULTS.font}
    >
      <body className={`${fontVars} min-h-screen antialiased`}>
        <PreferencesStoreProvider
          themeMode={PREFERENCE_DEFAULTS.theme_mode}
          themePreset={PREFERENCE_DEFAULTS.theme_preset}
          contentLayout={PREFERENCE_DEFAULTS.content_layout}
          navbarStyle={PREFERENCE_DEFAULTS.navbar_style}
          font={PREFERENCE_DEFAULTS.font}
        >
          {children}
          <Toaster />
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
