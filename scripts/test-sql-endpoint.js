const fs = require("fs");
const path = require("path");

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

async function testSqlEndpoints() {
  const endpoints = [
    `${supabaseUrl}/rest/v1/rpc/exec_sql`,
    `${supabaseUrl}/pg/query`,
    `https://api.supabase.com/v1/projects/wixksduiacaslpgnpzua/database/query`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "SELECT 1 as val;" }),
      });
      console.log(`Endpoint: ${ep} -> Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.slice(0, 200)}`);
    } catch (e) {
      console.log(`Endpoint: ${ep} -> Error: ${e.message}`);
    }
  }
}

testSqlEndpoints();
