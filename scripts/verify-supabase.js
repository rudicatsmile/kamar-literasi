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

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const tablesToCheck = [
  "categories",
  "articles",
  "resources",
  "statistics",
  "tips",
  "challenges",
  "challenge_days",
  "static_pages",
  "subscribers",
  "profiles"
];

async function verify() {
  console.log("=================================================");
  console.log("Checking Supabase connection to:", supabaseUrl);
  console.log("=================================================");

  let allOk = true;
  for (const table of tablesToCheck) {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: false });

      if (error) {
        console.log(`❌ Table [${table}]: ERROR - ${error.message} (code: ${error.code})`);
        allOk = false;
      } else {
        console.log(`✅ Table [${table}]: OK - ${data.length} row(s) found`);
      }
    } catch (e) {
      console.log(`❌ Table [${table}]: Exception - ${e.message}`);
      allOk = false;
    }
  }

  console.log("=================================================");
  if (allOk) {
    console.log("🎉 All tables verified successfully and populated!");
  } else {
    console.log("⚠️ Some tables are missing or not populated yet.");
  }
}

verify();
