import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend (modern email service)
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3; // 3 requests per minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const entry = rateLimit.get(ip)!;
  
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
};

// Enhanced validation
const validateInput = (data: ContactFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Name validation
  if (!data.name?.trim()) {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2 || data.name.trim().length > 100) {
    errors.push('Name must be between 2-100 characters');
  } else if (!/^[a-zA-Z\s\-'\.]+$/.test(data.name.trim())) {
    errors.push('Name contains invalid characters');
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
    errors.push('Please enter a valid email address');
  } else if (data.email.length > 320) {
    errors.push('Email address is too long');
  }

  // Subject validation
  if (!data.subject?.trim()) {
    errors.push('Subject is required');
  } else if (data.subject.trim().length < 5 || data.subject.trim().length > 200) {
    errors.push('Subject must be between 5-200 characters');
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.push('Message is required');
  } else if (data.message.trim().length < 20 || data.message.trim().length > 2000) {
    errors.push('Message must be between 20-2000 characters');
  }

  return { isValid: errors.length === 0, errors };
};

// Sanitize input
const sanitizeInput = (data: ContactFormData): ContactFormData => {
  return {
    name: data.name.trim().replace(/\s+/g, ' '),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim().replace(/\s+/g, ' '),
    message: data.message.trim(),
  };
};

// Modern HTML email template
const createEmailTemplate = (data: ContactFormData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">
        ✨ New Contact Message
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">
        Someone reached out through your website
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <!-- Subject -->
      <div style="margin-bottom: 32px;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #6366f1;">
          <p style="margin: 0; color: #475569; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject</p>
          <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 18px; font-weight: 600; line-height: 1.4;">${data.subject}</p>
        </div>
      </div>

      <!-- Sender Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #22c55e;">
          <p style="margin: 0; color: #16a34a; font-size: 14px; font-weight: 600;">Name</p>
          <p style="margin: 8px 0 0 0; color: #15803d; font-size: 16px; font-weight: 500;">${data.name}</p>
        </div>
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #d97706; font-size: 14px; font-weight: 600;">Email</p>
          <p style="margin: 8px 0 0 0; color: #b45309; font-size: 16px; font-weight: 500;">
            <a href="mailto:${data.email}" style="color: #6366f1; text-decoration: none;">${data.email}</a>
          </p>
        </div>
      </div>

      <!-- Message -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Message</h3>
        <div style="background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #334155; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" 
           style="display: inline-block; background: #6366f1; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.2s;">
          📧 Reply to ${data.name}
        </a>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          Sent from your portfolio contact form • ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before sending another message.' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: ContactFormData;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error('CONTACT_EMAIL is not configured');
      return NextResponse.json(
        { error: 'Recipient email not configured' },
        { status: 500 }
      );
    }

    // Sanitize data
    const sanitizedData = sanitizeInput(body);

    const fromAddress = process.env.RESEND_DOMAIN 
      ? `Portfolio Contact <noreply@${process.env.RESEND_DOMAIN}>`
      : 'Portfolio Contact <onboarding@resend.dev>';

    console.log('🔧 Sending email with config:', {
      from: fromAddress,
      to: process.env.CONTACT_EMAIL,
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyLength: process.env.RESEND_API_KEY?.length || 0
    });

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: [process.env.CONTACT_EMAIL!],
      replyTo: sanitizedData.email,
      subject: `💌 New Contact: ${sanitizedData.subject}`,
      html: createEmailTemplate(sanitizedData),
      text: `
New Contact Form Message

From: ${sanitizedData.name} (${sanitizedData.email})
Subject: ${sanitizedData.subject}

Message:
${sanitizedData.message}

---
Sent: ${new Date().toISOString()}
      `.trim(),
    });

    // Check if email was sent successfully
    if (emailResult.error) {
      console.error('❌ Resend error details:', emailResult.error);
      console.error('Environment check:', {
        hasApiKey: !!process.env.RESEND_API_KEY,
        hasContactEmail: !!process.env.CONTACT_EMAIL,
        domain: process.env.RESEND_DOMAIN || 'not-set'
      });
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully:', emailResult.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      id: emailResult.data?.id
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return NextResponse.json({
      error: 'Something went wrong. Please try again later.'
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}