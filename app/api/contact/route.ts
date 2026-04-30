import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("CRITICAL: RESEND_API_KEY is missing in .env.local");
      return NextResponse.json(
        { error: "Server configuration error: Missing API Key." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [process.env.RESEND_EMAIL_USED || "maverickdanielle@gmail.com"],
      subject: `Portfolio: ${subject || "New Message"} from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6055F0; margin-top: 0;">New Portfolio Message</h2>
          <div style="background: #fdfdfd; padding: 15px; border-radius: 8px; border: 1px solid #f0f0f0;">
            <p style="margin: 5px 0;"><strong>From:</strong> ${name} (${email})</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject || "No Subject"}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Message Content:</p>
          <div style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px; line-height: 1.6;">${message}</div>
          <p style="font-size: 11px; color: #999; margin-top: 30px;">Sent from Maverick's Portfolio Contact Form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Contact API Route Error:", err);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}