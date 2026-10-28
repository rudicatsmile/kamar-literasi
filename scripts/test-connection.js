const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);
const supabase = createClient(supabaseUrl, serviceKey);

async function test() {
  try {
    const { data, error } = await supabase.from("categories").select("*").limit(1);
    console.log("Categories query result:", { data, error });
  } catch (e) {
    console.error("Exception querying categories:", e);
  }
}

test();
