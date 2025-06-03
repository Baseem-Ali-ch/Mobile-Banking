import { EditProfileForm } from "@/components/profile/edit-profile-form"

export default function EditProfilePage() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
      <div className="mt-6">
        <EditProfileForm />
      </div>
    </div>
  )
}
