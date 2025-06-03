import { ProfileOverview } from "@/components/profile/profile-overview"

export default function ProfilePage() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
      <div className="mt-6">
        <ProfileOverview />
      </div>
    </div>
  )
}
