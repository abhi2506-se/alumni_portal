// lib/utils/email.ts – Nodemailer email sending
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Alumni Portal" <${process.env.SMTP_USER}>`;

// ─── OTP email ────────────────────────────────────────────────────────────────
export async function sendOTPEmail(email: string, otp: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to:   email,
    subject: 'Verify your Alumni Portal account',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:'DM Sans',sans-serif;background:#f0f4ff;margin:0;padding:40px 20px;">
        <div style="max-width:520px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,42,133,0.08);">
          <div style="background:linear-gradient(135deg,#1e2a85,#3b5ff4);padding:32px;text-align:center;">
            <h1 style="color:#fbbf24;font-family:Georgia,serif;margin:0;font-size:28px;">Alumni Portal</h1>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#1e2a85;font-family:Georgia,serif;">Hello, ${name}!</h2>
            <p style="color:#4b5563;">Your one-time verification code is:</p>
            <div style="background:#f0f4ff;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
              <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#1e2a85;">${otp}</span>
            </div>
            <p style="color:#6b7280;font-size:14px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <div style="background:#f9fafb;padding:20px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">© 2024 Alumni Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// ─── Approval email ───────────────────────────────────────────────────────────
export async function sendApprovalEmail(email: string, name: string, approved: boolean, reason?: string) {
  await transporter.sendMail({
    from: FROM,
    to:   email,
    subject: approved ? '🎉 Account Approved – Alumni Portal' : 'Account Status Update – Alumni Portal',
    html: `
      <div style="font-family:'DM Sans',sans-serif;max-width:520px;margin:auto;">
        <div style="background:${approved ? 'linear-gradient(135deg,#1e2a85,#3b5ff4)' : 'linear-gradient(135deg,#7f1d1d,#dc2626)'};padding:32px;border-radius:16px 16px 0 0;text-align:center;">
          <h1 style="color:#fbbf24;font-family:Georgia,serif;margin:0;">Alumni Portal</h1>
        </div>
        <div style="padding:40px;background:#fff;border-radius:0 0 16px 16px;">
          <h2 style="color:#1e2a85;">${approved ? '🎉 You\'re approved!' : '⚠️ Account Update'}</h2>
          <p>Dear ${name},</p>
          ${approved
            ? '<p>Your account has been <strong style="color:#16a34a;">approved</strong>! You can now log in and access all features of the Alumni Portal.</p>'
            : `<p>Your account request has been <strong style="color:#dc2626;">not approved</strong> at this time.</p>${reason ? `<p>Reason: ${reason}</p>` : ''}`
          }
          <a href="${process.env.NEXTAUTH_URL}/login" style="display:inline-block;margin-top:20px;padding:14px 28px;background:#1e2a85;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;">
            ${approved ? 'Login Now →' : 'Contact Support'}
          </a>
        </div>
      </div>
    `,
  });
}

// ─── Mentorship booking ───────────────────────────────────────────────────────
export async function sendMentorshipEmail(
  mentorEmail: string,
  menteeEmail: string,
  topic: string,
  date: Date,
  mentorName: string,
  menteeName: string,
) {
  const dateStr = date.toLocaleDateString('en-IN', { dateStyle: 'full' });
  const timeStr = date.toLocaleTimeString('en-IN', { timeStyle: 'short' });
  const body = (recipientName: string, otherName: string, role: string) => `
    <div style="font-family:'DM Sans',sans-serif;max-width:520px;margin:auto;">
      <div style="background:linear-gradient(135deg,#1e2a85,#3b5ff4);padding:32px;border-radius:16px 16px 0 0;text-align:center;">
        <h1 style="color:#fbbf24;font-family:Georgia,serif;margin:0;">Alumni Portal</h1>
      </div>
      <div style="padding:40px;background:#fff;border-radius:0 0 16px 16px;">
        <h2 style="color:#1e2a85;">📅 Mentorship Session Confirmed</h2>
        <p>Hi ${recipientName},</p>
        <p>A mentorship session has been booked with <strong>${otherName}</strong>.</p>
        <div style="background:#f0f4ff;padding:20px;border-radius:12px;margin:20px 0;">
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Date:</strong> ${dateStr}</p>
          <p><strong>Time:</strong> ${timeStr}</p>
          <p><strong>Your role:</strong> ${role}</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/mentorship" style="display:inline-block;margin-top:10px;padding:14px 28px;background:#f59e0b;color:#1e2a85;border-radius:10px;text-decoration:none;font-weight:700;">
          View Session →
        </a>
      </div>
    </div>
  `;

  await Promise.all([
    transporter.sendMail({ from: FROM, to: mentorEmail, subject: '📅 New Mentorship Session', html: body(mentorName, menteeName, 'Mentor') }),
    transporter.sendMail({ from: FROM, to: menteeEmail, subject: '📅 Mentorship Session Confirmed', html: body(menteeName, mentorName, 'Mentee') }),
  ]);
}

// ─── Generate 6-digit OTP ─────────────────────────────────────────────────────
export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
