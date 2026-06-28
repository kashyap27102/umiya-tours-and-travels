"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import type { SiteSettingsData } from "@/types";
import { BusinessTab } from "./tabs/BusinessTab";
import { HeroTab } from "./tabs/HeroTab";
import { AboutTab } from "./tabs/AboutTab";
import { StatsTab } from "./tabs/StatsTab";
import { TestimonialsTab } from "./tabs/TestimonialsTab";
import { FooterTab } from "./tabs/FooterTab";

const TABS = [
  { value: "business", label: "Business" },
  { value: "hero", label: "Hero" },
  { value: "about", label: "About" },
  { value: "stats", label: "Stats" },
  { value: "testimonials", label: "Testimonials" },
  { value: "footer", label: "Footer" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSettingsData | null }) {
  const [activeTab, setActiveTab] = useState<TabValue>("business");
  const s = initialSettings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">Settings</h1>
        <p className="text-sm text-brand-muted-600">Manage content displayed on the public website.</p>
      </div>

      {!s && (
        <div className="rounded-lg border border-brand-blue-900/10 bg-brand-mist-200/50 px-4 py-3 text-sm text-brand-muted-600">
          No settings saved yet. Fill in each tab and save to publish your site content.
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <div className="overflow-x-auto pb-0.5">
          <TabsList className="inline-flex gap-1 rounded-xl bg-brand-mist-200/60 p-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-white text-brand-blue-700 shadow-sm"
                    : "text-brand-muted-600 hover:text-brand-ink-900 cursor-pointer"
                }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="business" className="mt-4">
          <BusinessTab defaults={{
            siteName: s?.siteName ?? "",
            phone: s?.phone ?? "",
            email: s?.email ?? "",
            whatsappNumber: s?.whatsappNumber ?? "",
            address: s?.address ?? "",
          }} />
        </TabsContent>

        <TabsContent value="hero" className="mt-4">
          <HeroTab defaults={{
            heroEyebrow: s?.heroEyebrow ?? "",
            heroHeading: s?.heroHeading ?? "",
            heroSubheading: s?.heroSubheading ?? "",
          }} />
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <AboutTab defaults={{
            aboutHeading: s?.aboutHeading ?? "",
            aboutDescription: s?.aboutDescription ?? "",
            missionHeading: s?.missionHeading ?? "",
            missionDescription: s?.missionDescription ?? "",
          }} />
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <StatsTab defaults={{ stats: s?.stats ?? [] }} />
        </TabsContent>

        <TabsContent value="testimonials" className="mt-4">
          <TestimonialsTab defaults={{ testimonials: s?.testimonials ?? [] }} />
        </TabsContent>

        <TabsContent value="footer" className="mt-4">
          <FooterTab defaults={{ footerTagline: s?.footerTagline ?? "" }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
