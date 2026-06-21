import { SettingsService } from "@/services";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await SettingsService.getSettings();

  return <SettingsForm initialSettings={settings} />;
}
