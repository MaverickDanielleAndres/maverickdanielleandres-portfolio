import { NextRequest, NextResponse } from 'next/server';

// Personal data to inject into system prompt
const PERSONAL_DATA = {
  name: "Maverick Danielle P. Andres",
  role: "Full-Stack Web Developer & IT Specialist",
  availability: "Available for freelance and internship opportunities. I can apply to anything related to my skills. Contact me anytime via email or phone.",
  location: "Pasig City, Philippines",
  phone: "+63 9632968188",
  contact: {
    email: "maverickdanielle@gmail.com",
    linkedin: "https://www.linkedin.com/in/maverick-danielle-andres/",
    github: "https://github.com/MaverickDanielleAndres",
    portfolio: "https://maverickdanielleandres-portfolio-tp.vercel.app"
  },
  education: {
    institution: "Pamantasan ng Lungsod ng Pasig",
    degree: "Bachelor's in Information Technology",
    period: "Aug 2022 - May 2026",
    gwa: "3.50",
    status: "4th Year Student",
    achievements: "Consistent Dean's Lister (1st-4th Year), President's Lister",
    organizations: "Member: PLP Computer Society, PhilDev She++ for Male Students of PLP (Participant)",
    coursework: "Web Design and Development, Database Management Systems, Network Administration, Cybersecurity, Computer Networks & Security, System Administration, and Maintenance"
  },
  skills: {
    programming: ["HTML", "CSS", "JavaScript", "PHP", "SQL", "Node.js", "Python"],
    frameworks: ["React.js", "Next.js", "jQuery", "Tailwind CSS", "Bootstrap", "Express.js"],
    databases: ["MySQL", "PostgreSQL", "Supabase"],
    tools: ["Git", "GitHub", "Postman", "XAMPP", "VSCode", "Vercel", "Figma"],
    networking: ["Network Fundamentals", "IP Addressing & Subnetting", "Routing & Switching Concepts", "Setting Up LAN/WAN", "Network Troubleshooting and Security", "Basic Cisco Configuration", "Hardware/PC Troubleshooting"],
    design: ["Figma", "UI/UX Design"]
  },
  experience: [
    {
      company: "Department of Education Central",
      location: "Pasig City, PH",
      position: "Spes Clerk | Encoding, Database Input",
      period: "May 2024 - Aug 2024",
      achievements: [
        "Processed and encoded 1,000+ official documents into the central database with 99% accuracy",
        "Streamlined routing document and filling workflows, reducing document retrieval time by 30% for administrative staff",
        "Assisted a team of 10+ personnel under the undersecretary for administration by ensuring timely routing and tracking of incoming/outgoing documents"
      ]
    },
    {
      company: "Freelance",
      location: "PH",
      position: "Freelance Web Developer",
      period: "Nov 2024 – 2025",
      achievements: [
        "Completed 1+ full capstone system and projects for student clients",
        "Delivered end-to-end web applications using PHP, MySQL, HTML, CSS, JavaScript, and Bootstrap"
      ]
    }
  ],
  projects: [
    {
      name: "Learning Management System with AI-Generated Reviewer",
      description: "Led the full development and deployment of the LMS for 1,000+ students and teachers, managing system architecture, workflow design, and project timeline. Integrated advanced AI features including material summarization, AI chatbot, auto question and flashcard generation, passing rate prediction, analytics, and more. Built complete authentication, multi-role access, security, and deployment management (web hosting).",
      tech: ["PHP", "HTML", "CSS", "Bootstrap", "JavaScript", "MySQL"],
      period: "Aug - Nov 2025"
    },
    {
      name: "E-Community Engagement Platform",
      description: "Built a modern, secure community platform featuring voting/surveys, complaint reporting, messaging, group channels, notifications, and community management tools. Integrated AI assistance, sentiment analysis, and role-based security.",
      tech: ["Next.js", "React", "Tailwind CSS", "Node.js", "Express", "Supabase", "PostgreSQL"],
      period: "Oct - Nov 2025"
    },
    {
      name: "Barangay Ugong Gym Registration System",
      description: "Designed the entire UI and led a team development effort to build a registration and membership tracking system for barangay gym users. Implemented automated approval workflows, membership ID generation, and centralized user management pages.",
      tech: ["PHP", "HTML", "CSS", "Bootstrap", "JavaScript", "MySQL"],
      period: "Nov 2024"
    },
    {
      name: "Barangay Health System",
      description: "Led a team of 4–6 members in building a complete health record management system with patient profiles, check-up logs, and barangay-level monitoring tools. Designed and implemented full front-end and back-end handling of CRUD modules and admin workflows.",
      tech: ["PHP", "HTML", "CSS", "Bootstrap", "JavaScript", "MySQL"],
      period: "May 2024"
    }
  ],
  certifications: [
    "The Complete Full-Stack Web Development Bootcamp",
    "Web Development Bootcamp with HTML, CSS, PHP, MySQL, WordPress",
    "PHP with MySQL & Practical SQL: Query & Manage Databases",
    "Git, GitLab, GitHub Fundamentals for Software Developers",
    "The Complete Networking Fundamentals Course – CCNA and Information Security Crash Course",
    "Figma Essentials for User Interface and User Experience (UI/UX)",
    "Complete MS Office and Web Design Development Course"
  ]
};

const SYSTEM_PROMPT = `You are an AI assistant for Maverick Danielle Andres's portfolio website. Your role is to answer questions about Maverick professionally and accurately.

PERSONAL INFORMATION:
- Name: ${PERSONAL_DATA.name}
- Role: ${PERSONAL_DATA.role}
- Location: ${PERSONAL_DATA.location}
- Phone: ${PERSONAL_DATA.phone}
- Availability: ${PERSONAL_DATA.availability}

EDUCATION:
- ${PERSONAL_DATA.education.institution}
- ${PERSONAL_DATA.education.degree} (${PERSONAL_DATA.education.period})
- Status: ${PERSONAL_DATA.education.status}
- GWA: ${PERSONAL_DATA.education.gwa}
- Achievements: ${PERSONAL_DATA.education.achievements}
- Organizations: ${PERSONAL_DATA.education.organizations}
- Relevant Coursework: ${PERSONAL_DATA.education.coursework}

TECHNICAL SKILLS:
- Programming Languages: ${PERSONAL_DATA.skills.programming.join(', ')}
- Frameworks & Libraries: ${PERSONAL_DATA.skills.frameworks.join(', ')}
- Databases: ${PERSONAL_DATA.skills.databases.join(', ')}
- Tools & Technologies: ${PERSONAL_DATA.skills.tools.join(', ')}
- Networking: ${PERSONAL_DATA.skills.networking.join(', ')}
- Design: ${PERSONAL_DATA.skills.design.join(', ')}

WORK EXPERIENCE:
${PERSONAL_DATA.experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.location}) - ${exp.period}\n  ${exp.achievements.join('\n  ')}`).join('\n\n')}

KEY PROJECTS:
${PERSONAL_DATA.projects.map(p => `- ${p.name} (${p.period}): ${p.description} (Tech: ${p.tech.join(', ')})`).join('\n\n')}

CERTIFICATIONS:
${PERSONAL_DATA.certifications.map(cert => `- ${cert}`).join('\n')}

CONTACT:
- Email: ${PERSONAL_DATA.contact.email}
- Phone: ${PERSONAL_DATA.phone}
- LinkedIn: ${PERSONAL_DATA.contact.linkedin}
- GitHub: ${PERSONAL_DATA.contact.github}
- Portfolio: ${PERSONAL_DATA.contact.portfolio}

RULES:
1. Be a helpful AI assistant for Maverick's portfolio website
2. Answer questions about Maverick professionally and accurately
3. For general questions or topics not related to Maverick, provide helpful responses while gently steering the conversation back to Maverick's portfolio when appropriate
4. Be conversational, friendly, and engaging
5. If you don't have specific information about Maverick, be honest and suggest checking his portfolio or contacting him directly
6. Never make up information not provided above
7. Always provide Maverick's contact information when appropriate
8. Keep responses concise but informative

Examples of good responses:
- User: "What are Maverick's skills?" → List the skills naturally and conversationally
- User: "Tell me about the weather" → "I'm not sure about the weather, but I can tell you about Maverick's skills in web development!"
- User: "How can I contact Maverick?" → Provide email, phone, and LinkedIn with a friendly tone`;

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client identifier
    const identifier = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'anonymous';

    // Rate limiting
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: message is required' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 1000 characters.' },
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OpenAI API Key not found. Please set OPENAI_API_KEY in .env.local');
      return NextResponse.json(
        { response: "I apologize, but I'm currently unavailable. Please contact Maverick directly at maverickdanielle@gmail.com or view his portfolio for more information." },
        { status: 200 }
      );
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })) : []),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', response.status, errorData);

      // Provide a fallback response instead of error
      return NextResponse.json({
        response: "I'm having trouble connecting right now. Here's what I can tell you: Maverick is a Full-Stack Web Developer with expertise in React, Next.js, PHP, and database management. He's currently completing his IT degree at Pamantasan ng Lungsod ng Pasig with a 3.50 GWA. You can reach him at maverickdanielle@gmail.com or call +63 9632968188 for more information."
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ response: assistantMessage.trim() });

  } catch (error: any) {
    console.error('Chat API error:', error);

    // Provide fallback response
    return NextResponse.json({
      response: "I apologize for the inconvenience. While I'm experiencing technical difficulties, you can learn about Maverick by exploring his portfolio or contacting him directly at maverickdanielle@gmail.com."
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
