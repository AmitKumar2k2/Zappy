import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Zappy Support" <${process.env.SMTP_USER || 'no-reply@zappy.com'}>`,
            to: email,
            subject: 'Your Zappy Verification Code',
            text: `Your verification code is: ${otp}. It will expire in 30 seconds.`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4F46E5;">Zappy Vendor Verification</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for verification is:</p>
          <h1 style="background-color: #F3F4F6; padding: 10px 20px; display: inline-block; letter-spacing: 5px; border-radius: 5px;">${otp}</h1>
          <p>This code is valid for 30 seconds.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
