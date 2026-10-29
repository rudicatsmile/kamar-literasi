import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = (match[2] || "").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error, count } = await supabase
    .from("article_reading_sessions")
    .select("*", { count: "exact" })
    .limit(5);

  if (error) {
    console.log("RESULT: TABLE_NOT_FOUND_OR_ERROR");
    console.log("Error details:", error.message, error.code);
  } else {
    console.log("RESULT: TABLE_EXISTS");
    console.log("Total rows in DB:", count);
    console.log("Sample data:", data);
  }
}

main().catch(console.error);

