import { Preferences } from "@/components/profile/preferences"

export default function PreferencesPage() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold tracking-tight">Preferences</h1>
      <div className="mt-6">
        <Preferences />
      </div>
    </div>
  )
}
