/**
 * One-shot smoke test: render and send a sample contact-form email.
 *
 * Run from the project root:
 *   npx tsx scripts/test-contact-email.ts
 *
 * Uses the same template + sanitization + Resend singleton as the
 * `/api/contact` route so any visual or send-path regression shows up
 * here first.
 */

import "dotenv/config";
import { pathToFileURL } from "node:url";

async function main() {
  // Lazy-load so dotenv has a chance to populate process.env.
  const { getFromAddress, getRecipientAddress, getResendClient } = await import(
    pathToFileURL(
      new URL("../lib/email/resend.ts", import.meta.url).pathname,
    ).href
  );
  const {
    emailShell,
    dataRow,
    dataTable,
    messageBlock,
    sectionHeading,
    ctaButton,
  } = await import(
    pathToFileURL(
      new URL("../lib/email/templates.ts", import.meta.url).pathname,
    ).href
  );
  const { escapeHtml } = await import(
    pathToFileURL(
      new URL("../lib/email/sanitize.ts", import.meta.url).pathname,
    ).href
  );

  const sample = {
    name: "Maverick Danielle Andres",
    email: "maverickdanielle@gmail.com",
    subject: "Smoke test from portfolio contact form",
    message:
      "Hey Maverick!\n\nThis is a smoke test of the contact-form email pipeline. If you're reading this, the Resend integration is wired correctly and the formatted HTML rendered as expected.\n\nReply to this email to confirm the replyTo header also points to the visitor address.\n\n— Mavs AI",
  };

  const sName = escapeHtml(sample.name);
  const sEmail = escapeHtml(sample.email);
  const sSubject = escapeHtml(sample.subject);
  const sMessage = escapeHtml(sample.message).replace(/\n/g, "<br />");

  const receivedAt = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const senderTable = dataTable(
    dataRow("Name", sName) +
      dataRow(
        "Email",
        `<a href="mailto:${sEmail}" style="color:#6055F0;text-decoration:none;font-weight:600;">${sEmail}</a>`,
      ) +
      dataRow("Subject", sSubject) +
      dataRow(
        "Received",
        `<span style="color:#94A3B8;">${escapeHtml(receivedAt)}</span>`,
      ),
  );

  const bodyHtml = `
    ${sectionHeading("Sender")}
    ${senderTable}

    ${sectionHeading("Message")}
    ${messageBlock(sMessage)}
  `;

  const ctaHtml = ctaButton(
    `Reply to ${sample.name.split(" ")[0]}`,
    `mailto:${sample.email}?subject=${encodeURIComponent(`Re: ${sample.subject}`)}`,
  );

  const htmlContent = emailShell({
    eyebrow: "Portfolio · Contact form",
    title: "New contact message",
    subtitle: `From ${sample.name} — ${sample.subject}`,
    preheader: `${sample.name} just reached out: ${sample.subject}`,
    bodyHtml,
    ctaHtml,
  });

  console.log("─".repeat(72));
  console.log("From:    ", getFromAddress());
  console.log("To:      ", getRecipientAddress());
  console.log("Subject: ", `Portfolio: ${sample.subject} from ${sample.name}`);
  console.log("─".repeat(72));

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: [getRecipientAddress()],
    replyTo: sample.email,
    subject: `Portfolio: ${sample.subject} from ${sample.name}`.slice(0, 256),
    html: htmlContent,
  });

  if (error) {
    console.error("Resend returned an error:");
    console.error(JSON.stringify(error, null, 2));
    console.error(
      "\nIf the FROM address isn't a Resend-verified domain, the sandbox",
    );
    console.error(
      "(onboarding@resend.dev) can be used as a fallback for testing —",
    );
    console.error("but it only delivers to the Resend account owner.");
    process.exit(1);
  }

  console.log("Sent. Resend returned:");
  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
