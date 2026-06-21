import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SettingsService } from "@/services";
import React from "react";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await SettingsService.getCachedSettings();

  return (
    <div>
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber ?? ""} />
    </div>
  );
}
