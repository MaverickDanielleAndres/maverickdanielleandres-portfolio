// Sandbox-mode test: uses Resend's `onboarding@resend.dev` as FROM so
// the formatted email actually delivers to the Resend account owner.
// The Resend account owner is the email tied to the API key, which is
// maverickdanielle@gmail.com — so this lands in the portfolio owner's
// inbox for verification.
//
// This script does NOT modify `.env.local`. It overrides the FROM
// address at runtime so the production config stays intact.

import { readFileSync } from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

// Force the sandbox FROM so the email actually delivers.
const fromAddress = "Portfolio <onboarding@resend.dev>";
const toAddress = env.PROJECT_INQUIRY_EMAIL;

console.log("From (sandbox):", fromAddress);
console.log("To:            ", toAddress);

// Render the same HTML the contact route would send. The visitor's
// name + email are passed so the replyTo header points back to a real
// address and the template's CTA button works.
const visitor = {
  name: "Maverick Danielle Andres",
  email: "maverickdanielle@gmail.com",
  firstName: "Maverick",
};
const subject = "Smoke test from portfolio contact form";
const messageHtml = `
  <p style="margin:0 0 12px;">Hey Maverick! 👋</p>
  <p style="margin:0 0 12px;">This is a smoke test of the contact-form email pipeline. If you are reading this in your inbox, the formatted HTML template renders correctly in real email clients.</p>
  <p style="margin:0 0 12px;">Reply to this email to confirm the <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:ui-monospace,monospace;">replyTo</code> header is wired correctly — your reply should go to <strong>${visitor.email}</strong>.</p>
  <p style="margin:24px 0 0;color:#64748b;font-size:13px;">— Mavs AI smoke-test suite</p>
`;

const receivedAt = new Date().toLocaleString("en-US", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

const senderTable = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:36%;font-weight:600;letter-spacing:0.02em;">Name</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${visitor.name}</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;letter-spacing:0.02em;">Email</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">
        <a href="mailto:${visitor.email}" style="color:#ea580c;text-decoration:none;font-weight:600;">${visitor.email}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;letter-spacing:0.02em;">Subject</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${subject}</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;color:#64748b;font-size:13px;font-weight:600;letter-spacing:0.02em;">Received</td>
      <td style="padding:10px 12px;color:#475569;font-size:14px;">${receivedAt}</td>
    </tr>
  </table>`;

const messageBlock = `
  <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 20px;color:#0f172a;font-size:14px;line-height:1.65;">
    ${messageHtml}
  </div>`;

const cta = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
        <a href="mailto:${visitor.email}?subject=${encodeURIComponent(`Re: ${subject}`)}" target="_blank" rel="noopener noreferrer"
           style="display:inline-block;padding:12px 22px;background-color:#f97316;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;">
          Reply to ${visitor.firstName}
        </a>
      </td>
    </tr>
  </table>`;

const preheader = `${visitor.name} just reached out: ${subject}`;
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">
    <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f5f9;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:28px 32px;color:#ffffff;">
                <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;opacity:0.85;">Portfolio · Contact form</p>
                <h1 style="margin:6px 0 0;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.01em;">New contact message</h1>
                <p style="margin:8px 0 0;font-size:14px;line-height:1.5;opacity:0.92;">From ${visitor.name} — ${subject}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <h2 style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#ea580c;">Sender</h2>
                ${senderTable}
                <h2 style="margin:24px 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#ea580c;">Message</h2>
                ${messageBlock}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px;">
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 24px;border-top:1px solid #e2e8f0;background-color:#f8fafc;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;">Sent from your portfolio · Mavs Portfolio Assistant</p>
                <p style="margin:6px 0 0;font-size:11px;color:#64748b;">Reply directly to this email to respond to the visitor.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
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
    subject: `Portfolio: ${subject} from ${visitor.name}`,
    html,
  }),
});

console.log("HTTP", res.status);
const body = await res.text();
console.log(body);
