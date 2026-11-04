import { NextResponse } from "next/server";

// In-memory rate limiting to prevent spam / duplicate submissions
const submissionHistory = new Map<string, number>();

const DESTINATION_EMAIL = process.env.ADMIN_EMAIL || "manavgupta236@gmail.com";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastSubmission = submissionHistory.get(ip);

    // Rate limit: 1 submission per 10 seconds per IP
    if (lastSubmission && now - lastSubmission < 10000) {
      return NextResponse.json(
        { success: false, error: "Please wait a moment before sending another message." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, email, subject, topic, message, _honey } = body;

    // Honeypot check for spam bots
    if (_honey) {
      return NextResponse.json({ success: true, message: "Message received." });
    }

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanSubject = typeof subject === "string" && subject.trim() ? subject.trim() : "Project Collaboration";
    const cleanTopic = typeof topic === "string" && topic.trim() ? topic.trim() : "General Inquiry";

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please write a message with at least 5 characters." },
        { status: 400 }
      );
    }

    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim();
    const sanitizedMessage = message.trim();

    let delivered = false;
    let providerUsed = "";

    // 1. Try Resend if RESEND_API_KEY is available
    if (process.env.RESEND_API_KEY) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [DESTINATION_EMAIL],
            reply_to: sanitizedEmail,
            subject: `[Portfolio] ${cleanSubject} — from ${sanitizedName}`,
            text: `New Portfolio Message:\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nTopic: ${cleanTopic}\nSubject: ${cleanSubject}\n\nMessage:\n${sanitizedMessage}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; color: #1c1917;">
                <h2 style="color: #f5871a; margin-top: 0;">New Message from Portfolio</h2>
                <p><strong>From:</strong> ${sanitizedName} (<a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>)</p>
                <p><strong>Enquiry Type:</strong> ${cleanTopic}</p>
                <p><strong>Subject:</strong> ${cleanSubject}</p>
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
                <h3 style="margin-bottom: 8px;">Message:</h3>
                <p style="white-space: pre-wrap; background: #fafaf9; padding: 16px; border-radius: 8px; line-height: 1.6;">${sanitizedMessage}</p>
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
                <p style="font-size: 13px; color: #78716c;">Reply directly to this email to contact ${sanitizedName}.</p>
              </div>
            `,
          }),
        });

        if (resendRes.ok) {
          delivered = true;
          providerUsed = "Resend";
        }
      } catch (err) {
        console.error("Resend delivery failed, falling back:", err);
      }
    }

    // 2. Try EmailJS if available and Resend was not used
    if (!delivered && process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID && process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      try {
        const emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            template_params: {
              name: sanitizedName,
              from_name: sanitizedName,
              email: sanitizedEmail,
              from_email: sanitizedEmail,
              reply_to: sanitizedEmail,
              to_email: DESTINATION_EMAIL,
              subject: cleanSubject,
              topic: cleanTopic,
              enquiry_type: cleanTopic,
              message: sanitizedMessage,
            },
          }),
        });

        if (emailjsRes.ok) {
          delivered = true;
          providerUsed = "EmailJS";
        }
      } catch (err) {
        console.error("EmailJS delivery failed, falling back:", err);
      }
    }

    // 3. Fallback to FormSubmit for 100% reliable direct delivery
    if (!delivered) {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: sanitizedName,
            email: sanitizedEmail,
            _replyto: sanitizedEmail,
            subject: `Portfolio Message: ${cleanSubject}`,
            enquiry_type: cleanTopic,
            message: sanitizedMessage,
            _captcha: "false",
            _template: "table",
          }),
        });

        const result = await formSubmitRes.json().catch(() => ({}));
        if (formSubmitRes.ok || String(result.success) === "true") {
          delivered = true;
          providerUsed = "FormSubmit";
        }
      } catch (err) {
        console.error("FormSubmit delivery failed:", err);
      }
    }

    if (!delivered) {
      return NextResponse.json(
        { success: false, error: `Unable to deliver message right now. Please email directly to ${DESTINATION_EMAIL}.` },
        { status: 502 }
      );
    }

    // Update rate limit on success
    submissionHistory.set(ip, now);

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. I will get back to you shortly.",
      provider: providerUsed,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
