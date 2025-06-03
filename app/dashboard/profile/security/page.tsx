import { SecuritySettings } from "@/components/profile/security-settings"

export default function SecuritySettingsPage() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
      <div className="mt-6">
        <SecuritySettings />
      </div>
    </div>
  )
}
