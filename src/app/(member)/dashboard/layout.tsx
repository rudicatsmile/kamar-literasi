import * as React from "react";
import { getCurrentUserProfile } from "@/lib/data";
import { MemberSidebarClient } from "./member-sidebar-client";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = await getCurrentUserProfile();

  return (
    <MemberSidebarClient userProfile={userProfile}>
      {children}
    </MemberSidebarClient>
  );
}
