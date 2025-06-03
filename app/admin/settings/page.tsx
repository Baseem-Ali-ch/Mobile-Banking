import type { Metadata } from "next"
import { SettingsContent } from "@/components/admin/settings-content"

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Configure system behavior, workflows, and security parameters",
}

export default function SettingsPage() {
  return <SettingsContent />
}
