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

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #1a1a1a; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0; color: #111;">New Contact Message 📬</h1>
          <p style="font-size: 15px; color: #666; margin-top: 8px;">Someone reached out via your portfolio's contact form.</p>
        </div>
        
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Sender Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; width: 30%; font-size: 14px;"><strong>Name</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Email</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;"><a href="mailto:${email}" style="color: #6055F0; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Subject</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${subject || "No Subject"}</td>
          </tr>
        </table>

        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Message</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea; line-height: 1.6; color: #333; margin-bottom: 32px; font-size: 15px; white-space: pre-wrap;">${message}</div>
        
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eaeaea; font-size: 13px; color: #999;">
          Sent from your portfolio contact form.
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [process.env.PROJECT_INQUIRY_EMAIL || process.env.RESEND_EMAIL_USED || "maverickdanielle@gmail.com"],
      subject: `Portfolio: ${subject || "New Message"} from ${name}`,
      replyTo: email,
      html: htmlContent,
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