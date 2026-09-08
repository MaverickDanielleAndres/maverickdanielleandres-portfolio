// Direct Resend API call to surface the verbose error.
import { readFileSync } from "node:fs";
import path from "node:path";

// Minimal .env.local parser (avoids dotenv dependency).
const envPath = path.join(process.cwd(), ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

console.log("From:    ", env.RESEND_FROM_EMAIL);
console.log("To:      ", env.PROJECT_INQUIRY_EMAIL);

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
  },
  body: JSON.stringify({
    from: env.RESEND_FROM_EMAIL,
    to: [env.PROJECT_INQUIRY_EMAIL],
    subject: "Smoke test from portfolio contact form",
    html: "<p>If you can read this, the direct Resend call worked.</p>",
  }),
});

console.log("HTTP", res.status);
const body = await res.text();
console.log(body);
