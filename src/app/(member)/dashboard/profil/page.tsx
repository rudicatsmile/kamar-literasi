import { getCurrentUserProfile } from "@/lib/data";
import { MemberProfilClientForm } from "./profil-form-client";

export default async function MemberProfilPage() {
  const userProfile = await getCurrentUserProfile();

  return <MemberProfilClientForm initialProfile={userProfile} />;
}
