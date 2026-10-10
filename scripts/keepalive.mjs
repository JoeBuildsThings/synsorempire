const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const endpoint = `${url.replace(/\/$/, "")}/rest/v1/categories?select=id&limit=1`;
const res = await fetch(endpoint, { headers: { apikey: key } });

if (!res.ok) {
  console.error("Database ping failed with status", res.status);
  process.exit(1);
}

console.log("Database responded with status", res.status);
