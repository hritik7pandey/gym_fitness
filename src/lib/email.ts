import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Fitsense" <noreply@fitsense.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    });

    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Email templates
export function generateOTPEmail(otp: string, purpose: 'verification' | 'reset'): string {
  const title = purpose === 'verification' ? 'Verify Your Email' : 'Reset Your Password';
  const message = purpose === 'verification' 
    ? 'Thank you for registering! Please verify your email using the OTP below:' 
    : 'We received a request to reset your password. Use the OTP below:';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #0A84FF, #BF5AF2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .otp-box { background: linear-gradient(135deg, rgba(10,132,255,0.1), rgba(191,90,242,0.05)); border: 2px solid #0A84FF; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp { font-size: 36px; font-weight: 700; color: #0A84FF; letter-spacing: 8px; }
        .message { color: #1d1d1f; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
        .footer { color: #86868b; font-size: 14px; text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Fitsense</div>
          <p style="color: #86868b; margin-top: 8px;">Fitness Hub</p>
        </div>
        <h2 style="color: #1d1d1f; margin-bottom: 16px;">${title}</h2>
        <p class="message">${message}</p>
        <div class="otp-box">
          <p style="color: #86868b; font-size: 14px; margin: 0 0 8px 0;">Your OTP Code</p>
          <div class="otp">${otp}</div>
          <p style="color: #86868b; font-size: 12px; margin: 8px 0 0 0;">Valid for 10 minutes</p>
        </div>
        <p class="message">If you didn't request this, please ignore this email.</p>
        <div class="footer">
          <p>© 2025 Fitsense. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateWelcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .logo { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #0A84FF, #BF5AF2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; }
        h1 { color: #1d1d1f; font-size: 24px; margin-top: 24px; }
        p { color: #1d1d1f; line-height: 1.6; }
        .footer { color: #86868b; font-size: 14px; text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Fitsense</div>
        <h1>Welcome to Fitsense, ${name}! 🎉</h1>
        <p>We're excited to have you join our fitness community.</p>
        <p>Your account has been verified successfully. You can now log in and start your fitness journey!</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Complete your profile</li>
          <li>Set your fitness goals</li>
          <li>Check out your personalized workout plans</li>
          <li>Track your progress</li>
        </ul>
        <div class="footer">
          <p>© 2025 Fitsense. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAbsenceAlert(name: string, daysAbsent: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .logo { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #0A84FF, #BF5AF2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; }
        h1 { color: #FF3B30; font-size: 24px; margin-top: 24px; }
        p { color: #1d1d1f; line-height: 1.6; }
        .cta { background: linear-gradient(135deg, #0A84FF, #BF5AF2); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; display: inline-block; margin-top: 20px; font-weight: 600; }
        .footer { color: #86868b; font-size: 14px; text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Fitsense</div>
        <h1>We Miss You, ${name}! 😢</h1>
        <p>It's been <strong>${daysAbsent} days</strong> since your last visit.</p>
        <p>Don't let your fitness goals slip away! Your workout routine is waiting for you.</p>
        <p>Come back and continue your journey to a healthier you!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta">Back to Dashboard</a>
        <div class="footer">
          <p>© 2025 Fitsense. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePremiumHubAccessEmail(name: string, expiryDate: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #0A84FF, #BF5AF2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .badge { background: linear-gradient(135deg, #0A84FF, #BF5AF2); color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; margin-top: 16px; }
        h1 { color: #1d1d1f; font-size: 28px; margin: 24px 0 16px; }
        .message { color: #1d1d1f; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
        .feature-box { background: linear-gradient(135deg, rgba(10,132,255,0.1), rgba(191,90,242,0.05)); border-radius: 16px; padding: 24px; margin: 24px 0; }
        .feature { display: flex; align-items: center; margin: 12px 0; color: #1d1d1f; }
        .feature-icon { width: 24px; height: 24px; background: linear-gradient(135deg, #0A84FF, #BF5AF2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px; font-size: 14px; }
        .expiry { background: #f5f5f7; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
        .cta { background: linear-gradient(135deg, #0A84FF, #BF5AF2); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; display: inline-block; margin-top: 20px; font-weight: 600; text-align: center; }
        .footer { color: #86868b; font-size: 14px; text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Fitsense</div>
          <div class="badge">🎉 PREMIUM HUB ACCESS</div>
        </div>
        <h1>Congratulations, ${name}! 🚀</h1>
        <p class="message">Your <strong>Premium Hub Access</strong> has been successfully activated! You now have full access to all the powerful features of Fitsense.</p>
        
        <div class="feature-box">
          <h3 style="color: #1d1d1f; margin-top: 0;">What's Unlocked:</h3>
          <div class="feature">
            <div class="feature-icon">💪</div>
            <span><strong>Workout Tracking</strong> - Log exercises, track progress, and view detailed stats</span>
          </div>
          <div class="feature">
            <div class="feature-icon">🥗</div>
            <span><strong>Nutrition Plans</strong> - Access personalized diet plans and meal tracking</span>
          </div>
          <div class="feature">
            <div class="feature-icon">📊</div>
            <span><strong>Attendance Management</strong> - Track gym visits and build streaks</span>
          </div>
          <div class="feature">
            <div class="feature-icon">🏆</div>
            <span><strong>Performance Analytics</strong> - Detailed insights and progress reports</span>
          </div>
        </div>

        <div class="expiry">
          <p style="margin: 0; color: #86868b; font-size: 14px;">Access Valid Until</p>
          <p style="margin: 8px 0 0; color: #1d1d1f; font-size: 20px; font-weight: 600;">${expiryDate}</p>
        </div>

        <p class="message">Ready to get started? Head to your dashboard and explore all the features!</p>
        
        <center>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="cta">Go to Dashboard</a>
        </center>

        <div class="footer">
          <p>Need help? Contact us at support@fitsense.com</p>
          <p style="margin-top: 8px;">© 2025 Fitsense. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
