import { NextResponse } from 'next/server';
import { db, contactMessages } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 필수 필드 검증
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, subject, and message are required' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // DB 저장
    await db.insert(contactMessages).values({
      name: name || '',
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
