import { NextResponse } from 'next/server';

// Revalidate this API route's response every hour (adjust as needed)
export const revalidate = 3600;
import { prisma } from '@/lib/prisma';

interface Params {
  params: { slug: string };
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    // Fetch a single published post by its unique slug
    // Include associated tags
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
        published: true, // Only fetch published posts
      },
      include: {
        tags: {
          select: { name: true }, // Only select tag names
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found or not published' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }
}