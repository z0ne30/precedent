import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all published posts, ordered by creation date descending
    // Include associated tags
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          select: { name: true }, // Only select tag names
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}