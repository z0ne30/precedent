import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import the singleton instance

export async function GET() {
  try {
    // Attempt to fetch all users from the database
    const users = await prisma.user.findMany();

    // Return the users as a JSON response
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Return an error response
    return NextResponse.json(
      { error: "Failed to connect to or query the database." },
      { status: 500 }
    );
  }
}