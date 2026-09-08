// Sandbox-mode test for the project-inquiry flow.
import { readFileSync } from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const fromAddress = "Maverick Portfolio <onboarding@resend.dev>";
const toAddress = env.PROJECT_INQUIRY_EMAIL;

console.log("From (sandbox):", fromAddress);
console.log("To:            ", toAddress);

const visitor = {
  intent: "build-new",
  projectType: "web-app",
  budget: "50k-100k",
  timeline: "1-2-months",
  name: "Maverick Danielle Andres",
  contactMethod: "email",
  email: "maverickdanielle@gmail.com",
  phone: "",
  company: "Mavs Studio",
  message:
    "Hi! I'd like to scope a customer-portal MVP for an existing SaaS client. The stack is Next.js + Postgres, and the scope includes auth, billing, and an admin dashboard. Looking for someone who can take it from spec to launch in 6–8 weeks.",
};

const labels = {
  intent: { "build-new": "Build Something New", "improve-existing": "Improve Existing", "hire-me": "Hire Me", "fix-add": "Fix / Add Features", "seo-performance": "SEO & Performance", "not-sure": "Not Sure Yet" },
  type: { website: "Website", "web-app": "Web App", "mobile-app": "Mobile App", "custom-system": "Custom System", ecommerce: "E-commerce", dashboard: "Dashboard / Internal Tool", "backend-api": "Backend / API", "something-else": "Something Else" },
  budget: { "under-25k": "Under ₱25K", "25k-50k": "₱25K – ₱50K", "50k-100k": "₱50K – ₱100K", "100k-plus": "₱100K+", "budget-unsure": "Not sure yet" },
  timeline: { asap: "ASAP", "2-4-weeks": "Within 2–4 weeks", "1-2-months": "1–2 months", "2-plus-months": "2+ months", flexible: "Flexible / Just exploring" },
};

const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const sName = escapeHtml(visitor.name);
const sEmail = escapeHtml(visitor.email);
const sCompany = escapeHtml(visitor.company);
const sMessage = escapeHtml(visitor.message).replace(/\n/g, "<br />");

const dataRow = (label, valueHtml) => `
  <tr>
    <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;color:#475569;font-size:13px;width:36%;vertical-align:top;font-weight:600;letter-spacing:0.02em;">${escapeHtml(label)}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;color:#0F172A;font-size:14px;line-height:1.55;vertical-align:top;">${valueHtml}</td>
  </tr>`;

const pill = (label) => `<span style="display:inline-block;padding:3px 10px;background-color:#6055F0;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;border-radius:999px;">${escapeHtml(label)}</span>`;

const receivedAt = new Date().toLocaleString("en-US", {
  weekday: "short", year: "numeric", month: "short", day: "numeric",
  hour: "numeric", minute: "2-digit", timeZoneName: "short",
});

const projectTable = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:#ffffff;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
    ${dataRow("Intent", pill(labels.intent[visitor.intent]))}
    ${dataRow("Type", escapeHtml(labels.type[visitor.projectType]))}
    ${dataRow("Budget", escapeHtml(labels.budget[visitor.budget]))}
    ${dataRow("Timeline", escapeHtml(labels.timeline[visitor.timeline]))}
  </table>`;

const contactTable = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:#ffffff;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
    ${dataRow("Name", sName)}
    ${dataRow("Company", sCompany)}
    ${dataRow("Preferred contact", `<span style="text-transform:capitalize;">${escapeHtml(visitor.contactMethod)}</span>`)}
    ${dataRow("Email", `<a href="mailto:${sEmail}" style="color:#6055F0;text-decoration:none;font-weight:600;">${sEmail}</a>`)}
    ${dataRow("Received", `<span style="color:#94A3B8;">${escapeHtml(receivedAt)}</span>`)}
  </table>`;

const messageBlock = `
  <div style="background-color:#F5F5F5;border:1px solid #E2E8F0;border-radius:10px;padding:18px 20px;color:#0F172A;font-size:14px;line-height:1.65;">
    ${sMessage}
  </div>`;

const replySubject = encodeURIComponent(`Re: Project inquiry — ${labels.type[visitor.projectType]}`);
const cta = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
        <a href="mailto:${sEmail}?subject=${replySubject}" target="_blank" rel="noopener noreferrer"
           style="display:inline-block;padding:12px 22px;background-color:#6055F0;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;">
          Reply to ${escapeHtml(visitor.name.split(" ")[0])}
        </a>
      </td>
    </tr>
  </table>`;

const subject = `New Project Inquiry — ${visitor.name} — ${labels.type[visitor.projectType]}`;
const preheader = `${visitor.name} wants to ${labels.intent[visitor.intent].toLowerCase()} a ${labels.type[visitor.projectType].toLowerCase()}.`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F1F1EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;-webkit-font-smoothing:antialiased;">
    <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:#F1F1EF;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F1F1EF;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 8px 24px rgba(15,23,42,0.06);">
          <tr><td style="background:linear-gradient(135deg,#6055F0 0%,#3b32b8 100%);padding:28px 32px;color:#ffffff;">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;opacity:0.85;">Portfolio · Project inquiry</p>
            <h1 style="margin:6px 0 0;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.01em;">New project inquiry</h1>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.5;opacity:0.92;">${escapeHtml(visitor.name)} — ${escapeHtml(labels.type[visitor.projectType])}</p>
          </td></tr>
          <tr><td style="padding:28px 32px 8px;background-color:#ffffff;">
            <h2 style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#6055F0;">Project</h2>
            ${projectTable}
            <h2 style="margin:24px 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#6055F0;">Contact</h2>
            ${contactTable}
            <h2 style="margin:24px 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#6055F0;">Additional message</h2>
            ${messageBlock}
          </td></tr>
          <tr><td style="padding:8px 32px 28px;background-color:#ffffff;">${cta}</td></tr>
          <tr><td style="padding:18px 32px 24px;border-top:1px solid #E2E8F0;background-color:#F5F5F5;">
            <p style="margin:0;font-size:12px;line-height:1.5;color:#475569;">Sent from your portfolio · Mavs Portfolio Assistant</p>
            <p style="margin:6px 0 0;font-size:11px;color:#94A3B8;">Reply directly to this email to respond to the visitor.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
  },
  body: JSON.stringify({
    from: fromAddress,
    to: [toAddress],
    replyTo: visitor.email,
    subject,
    html,
  }),
});

console.log("HTTP", res.status);
const body = await res.text();
console.log(body);
