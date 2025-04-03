import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Basic validation (can be expanded)
function validateInput(data: any) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    return 'Name is required.';
  }
  if (!data.email || typeof data.email !== 'string' || !/\S+@\S+\.\S+/.test(data.email)) {
    return 'Valid email is required.';
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
    return 'Message is required.';
  }
  return null; // No errors
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validate input
    const validationError = validateInput(formData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      },
    });

    // Return success response (don't return the full submission data)
    return NextResponse.json({ message: 'Submission received successfully!' });

  } catch (error) {
    console.error("Failed to process contact submission:", error);
    // Return generic server error
    return NextResponse.json(
      { error: "Failed to process submission." },
      { status: 500 }
    );
  }
}