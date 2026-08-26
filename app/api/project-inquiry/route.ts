import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const mapIntent = (id: string) => {
  const map: Record<string, string> = {
    'build-new': 'Build Something New',
    'improve-existing': 'Improve Existing',
    'hire-me': 'Hire Me',
    'fix-add': 'Fix / Add Features',
    'seo-performance': 'SEO & Performance',
    'not-sure': 'Not Sure Yet',
  };
  return map[id] || id;
};

const mapProjectType = (id: string) => {
  const map: Record<string, string> = {
    'website': 'Website',
    'web-app': 'Web App',
    'mobile-app': 'Mobile App',
    'custom-system': 'Custom System',
    'ecommerce': 'E-commerce',
    'dashboard': 'Dashboard / Internal Tool',
    'backend-api': 'Backend / API',
    'something-else': 'Something Else',
  };
  return map[id] || id;
};

const mapBudget = (id: string) => {
  const map: Record<string, string> = {
    'under-25k': 'Under ₱25K',
    '25k-50k': '₱25K – ₱50K',
    '50k-100k': '₱50K – ₱100K',
    '100k-plus': '₱100K+',
    'budget-unsure': 'Not sure yet',
  };
  return map[id] || id;
};

const mapTimeline = (id: string) => {
  const map: Record<string, string> = {
    'asap': 'ASAP',
    '2-4-weeks': 'Within 2–4 weeks',
    '1-2-months': '1–2 months',
    '2-plus-months': '2+ months',
    'flexible': 'Flexible / Just exploring',
  };
  return map[id] || id;
};

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
    const data = await request.json();
    const {
      intent,
      projectType,
      budget,
      timeline,
      name,
      contactMethod,
      email,
      phone,
      company,
      message,
    } = data;

    // Server-side validation
    if (!intent || !projectType || !budget || !timeline || !name || !contactMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Name is too long.' },
        { status: 400 }
      );
    }

    if (contactMethod === 'email') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return NextResponse.json(
          { success: false, message: 'Invalid email address.' },
          { status: 400 }
        );
      }
    } else if (contactMethod === 'phone') {
      if (!phone || phone.length < 7 || phone.length > 50) {
        return NextResponse.json(
          { success: false, message: 'Invalid phone number.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid contact method.' },
        { status: 400 }
      );
    }

    if (company && company.length > 150) {
      return NextResponse.json(
        { success: false, message: 'Company name is too long.' },
        { status: 400 }
      );
    }

    if (message && message.length > 5000) {
      return NextResponse.json(
        { success: false, message: 'Message is too long. Please keep it under 5000 characters.' },
        { status: 400 }
      );
    }

    // Build email HTML
    const sanitizedName = escapeHtml(name);
    const sanitizedCompany = company ? escapeHtml(company) : '';
    const sanitizedMessage = message ? escapeHtml(message).replace(/\n/g, '<br />') : 'No additional message provided.';
    const contactEmail = contactMethod === 'email' ? escapeHtml(email) : '';
    const contactPhone = contactMethod === 'phone' ? escapeHtml(phone) : '';

    const intentLabel = mapIntent(intent);
    const typeLabel = mapProjectType(projectType);

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #1a1a1a; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0; color: #111;">New Project Inquiry 🚀</h1>
          <p style="font-size: 15px; color: #666; margin-top: 8px;">You have received a new inquiry from your portfolio.</p>
        </div>
        
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Project Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; width: 40%; font-size: 14px;"><strong>Intent</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${intentLabel}</td>
          </tr>
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Project Type</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${typeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Budget</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${mapBudget(budget)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Timeline</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${mapTimeline(timeline)}</td>
          </tr>
        </table>

        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Client Information</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; width: 40%; font-size: 14px;"><strong>Name</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${sanitizedName}</td>
          </tr>
          ${sanitizedCompany ? `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Company</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;">${sanitizedCompany}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Preferred Contact</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px; text-transform: capitalize;">${contactMethod}</td>
          </tr>
          ${contactMethod === 'email' ? `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Email</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;"><a href="mailto:${contactEmail}" style="color: #6055F0; text-decoration: none;">${contactEmail}</a></td>
          </tr>` : ''}
          ${contactMethod === 'phone' ? `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;"><strong>Phone</strong></td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; color: #111; font-size: 15px;"><a href="tel:${contactPhone}" style="color: #6055F0; text-decoration: none;">${contactPhone}</a></td>
          </tr>` : ''}
        </table>

        ${sanitizedMessage && sanitizedMessage !== 'No additional message provided.' ? `
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Additional Message</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea; line-height: 1.6; color: #333; margin-bottom: 32px; font-size: 15px; white-space: pre-wrap;">${sanitizedMessage}</div>` : ''}
        
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eaeaea; font-size: 13px; color: #999;">
          Sent from your portfolio onboarding form.
        </div>
      </div>
    `;

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.PROJECT_INQUIRY_EMAIL || process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev';

    const emailResponse = await resend.emails.send({
      from: `Mavs Portfolio <${fromEmail}>`,
      to: toEmail,
      replyTo: contactMethod === 'email' ? email : undefined,
      subject: `New Project Inquiry — ${sanitizedName} — ${typeLabel}`,
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error('Resend Error:', emailResponse.error);
      return NextResponse.json(
        { success: false, message: 'Failed to send inquiry.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Project inquiry sent successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Project Inquiry API Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
