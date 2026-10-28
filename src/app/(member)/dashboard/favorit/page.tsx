import { getUserFavoriteResourcesList } from "@/lib/data";
import { MemberFavoritClientList } from "./favorit-client";

export default async function MemberFavoritPage() {
  const savedResources = await getUserFavoriteResourcesList();

  return <MemberFavoritClientList initialResources={savedResources} />;
}
