/**
 * Renders both the project-inquiry and contact-form emails using the
 * shared templates, and writes them to /tmp as standalone HTML files
 * for visual inspection. Does NOT send anything via Resend — this is
 * a pure render check so we can verify the dark mode branding without
 * hitting the API.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Use tsx-compatible dynamic import by reading & inlining the template.
import {
  ctaButton,
  dataRow,
  dataTable,
  emailShell,
  messageBlock,
  pill,
  sectionHeading,
} from "../lib/email/templates.ts";

function escapeHtml(input) {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ── Project inquiry render ────────────────────────────────────────── */

const INTENT_LABELS = {
  "build-new": "Build Something New",
  "improve-existing": "Improve Existing",
  "hire-me": "Hire Me",
  "fix-add": "Fix / Add Features",
  "seo-performance": "SEO & Performance",
  "not-sure": "Not Sure Yet",
};
const PROJECT_TYPE_LABELS = {
  website: "Website",
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  "custom-system": "Custom System",
  ecommerce: "E-commerce",
  dashboard: "Dashboard / Internal Tool",
  "backend-api": "Backend / API",
  "something-else": "Something Else",
};
const BUDGET_LABELS = {
  "under-25k": "Under ₱25K",
  "25k-50k": "₱25K – ₱50K",
  "50k-100k": "₱50K – ₱100K",
  "100k-plus": "₱100K+",
  "budget-unsure": "Not sure yet",
};
const TIMELINE_LABELS = {
  asap: "ASAP",
  "2-4-weeks": "Within 2–4 weeks",
  "1-2-months": "1–2 months",
  "2-plus-months": "2+ months",
  flexible: "Flexible / Just exploring",
};

const inquiry = {
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

const sName = escapeHtml(inquiry.name);
const sEmail = escapeHtml(inquiry.email);
const sCompany = escapeHtml(inquiry.company);
const sMessage = escapeHtml(inquiry.message).replace(/\n/g, "<br />");

const receivedAt = "Tue, Sep 8, 2026, 12:21 PM GMT+8";

const inquiryProjectTable = dataTable(
  dataRow("Intent", pill(INTENT_LABELS[inquiry.intent], "#6055F0")) +
    dataRow("Type", escapeHtml(PROJECT_TYPE_LABELS[inquiry.projectType])) +
    dataRow("Budget", escapeHtml(BUDGET_LABELS[inquiry.budget])) +
    dataRow("Timeline", escapeHtml(TIMELINE_LABELS[inquiry.timeline])),
);

const inquiryContactTable = dataTable(
  dataRow("Name", sName) +
    dataRow("Company", sCompany) +
    dataRow(
      "Preferred contact",
      `<span style="text-transform:capitalize;">${escapeHtml(inquiry.contactMethod)}</span>`,
    ) +
    dataRow(
      "Email",
      `<a href="mailto:${sEmail}" style="color:#6055F0;text-decoration:none;font-weight:600;">${sEmail}</a>`,
    ) +
    dataRow("Received", `<span style="color:#94A3B8;">${escapeHtml(receivedAt)}</span>`),
);

let inquiryBodyHtml = `
  ${sectionHeading("Project")}
  ${inquiryProjectTable}

  ${sectionHeading("Contact")}
  ${inquiryContactTable}
`;

if (inquiry.message && inquiry.message.trim().length > 0) {
  inquiryBodyHtml += `
    ${sectionHeading("Additional message")}
    ${messageBlock(sMessage)}
  `;
}

const inquiryCta = ctaButton(
  `Reply to ${inquiry.name.split(/\s+/)[0]}`,
  `mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: Project inquiry — ${PROJECT_TYPE_LABELS[inquiry.projectType]}`)}`,
);

const inquiryHtml = emailShell({
  eyebrow: "Portfolio · Project inquiry",
  title: "New project inquiry",
  subtitle: `${inquiry.name} — ${PROJECT_TYPE_LABELS[inquiry.projectType]}`,
  preheader: `${inquiry.name} wants to ${INTENT_LABELS[inquiry.intent].toLowerCase()} a ${PROJECT_TYPE_LABELS[inquiry.projectType].toLowerCase()}.`,
  bodyHtml: inquiryBodyHtml,
  ctaHtml: inquiryCta,
});

/* ── Contact form render ───────────────────────────────────────────── */

const contact = {
  name: "asdfasdf",
  email: "maverickdanielle@gmail.com",
  subject: "asdfasdf",
  message: "asdfasdfasdf",
};

const cName = escapeHtml(contact.name);
const cEmail = escapeHtml(contact.email);
const cSubject = escapeHtml(contact.subject);
const cMessage = escapeHtml(contact.message).replace(/\n/g, "<br />");

const contactSenderTable = dataTable(
  dataRow("Name", cName) +
    dataRow(
      "Email",
      `<a href="mailto:${cEmail}" style="color:#6055F0;text-decoration:none;font-weight:600;">${cEmail}</a>`,
    ) +
    dataRow("Subject", cSubject) +
    dataRow("Received", `<span style="color:#94A3B8;">${escapeHtml(receivedAt)}</span>`),
);

const contactBodyHtml = `
  ${sectionHeading("Sender")}
  ${contactSenderTable}

  ${sectionHeading("Message")}
  ${messageBlock(cMessage)}
`;

const contactCta = ctaButton(
  `Reply to ${contact.name.split(/\s+/)[0]}`,
  `mailto:${contact.email}?subject=${encodeURIComponent(`Re: ${contact.subject || "Your message"}`)}`,
);

const contactHtml = emailShell({
  eyebrow: "Portfolio · Contact form",
  title: "New contact message",
  subtitle: `From ${contact.name} — ${contact.subject || "no subject"}`,
  preheader: `${contact.name} just reached out: ${contact.subject || "no subject"}`,
  bodyHtml: contactBodyHtml,
  ctaHtml: contactCta,
});

/* ── Write outputs ─────────────────────────────────────────────────── */

const outDir = path.resolve("scripts/out");
mkdirSync(outDir, { recursive: true });

const inquiryPath = path.join(outDir, "inquiry.html");
const contactPath = path.join(outDir, "contact.html");
const combinedPath = path.join(outDir, "combined.html");

writeFileSync(inquiryPath, inquiryHtml);
writeFileSync(contactPath, contactHtml);

const combined = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Email previews</title>
    <style>
      html, body { margin: 0; padding: 0; background: #050505; color: #F0F0F0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .stack { display: flex; flex-direction: column; gap: 24px; padding: 32px 16px; align-items: center; }
      .label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.6; padding-top: 8px; }
      iframe { width: 100%; max-width: 640px; height: 880px; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; background: #0A0A0A; }
    </style>
  </head>
  <body>
    <div class="stack">
      <div class="label">Project inquiry email</div>
      <iframe srcdoc='${inquiryHtml.replace(/'/g, "&#39;")}'></iframe>
      <div class="label">Contact form email</div>
      <iframe srcdoc='${contactHtml.replace(/'/g, "&#39;")}'></iframe>
    </div>
  </body>
</html>`;

writeFileSync(combinedPath, combined);

console.log("✓ inquiry:", inquiryPath);
console.log("✓ contact:", contactPath);
console.log("✓ combined (side-by-side preview):", combinedPath);
