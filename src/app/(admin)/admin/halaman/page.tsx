import { getStaticPage } from "@/lib/data";
import { dummyStaticPages } from "@/lib/dummy-data";
import { AdminHalamanClient } from "./halaman-client";

export default async function AdminHalamanPage() {
  let pageData = dummyStaticPages.tentang;

  try {
    const fetched = await getStaticPage("tentang");
    if (fetched) {
      pageData = fetched;
    }
  } catch {
    pageData = dummyStaticPages.tentang;
  }

  return <AdminHalamanClient initialData={pageData} />;
}
