import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server'; // Remove Clerk import
import { getServerSession } from "next-auth/next"; // Import NextAuth session utility
import { authOptions } from "@/lib/auth"; // Import from shared auth file
import { prisma } from '@/lib/prisma';

// GET handler for fetching all posts (for admin list)
export async function GET(request: Request) {
  let session = null;
  const skipAuth = process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH_IN_DEV === 'true';

  if (!skipAuth) {
    session = await getServerSession(authOptions); // Get session using NextAuth

    // Check if user is authenticated
    if (!session || !session.user) { // Check for session and user object
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Check if user is admin
    if (session.user.isAdmin !== true) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } else {
    console.log("⚠️ Skipping auth check in DEV mode for /api/admin/posts GET");
  }

  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc', // Show most recently updated first
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST handler for creating a new post
export async function POST(request: Request) {
  let session = null; // Redefine for scope if needed, or reuse if possible
  const skipAuth = process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH_IN_DEV === 'true';

  if (!skipAuth) {
    session = await getServerSession(authOptions); // Get session using NextAuth

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Check if user is admin
    if (session.user.isAdmin !== true) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } else {
     console.log("⚠️ Skipping auth check in DEV mode for /api/admin/posts POST");
  }
  // TODO: If associating posts with users, use session.user.id
  // const userId = session.user.id;

  try {
    const body = await request.json();
    const { title, slug, content, published, tagNames } = body; // Expect tagNames as an array of strings

    // Basic validation
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields (title, slug, content)' }, { status: 400 });
    }

    // Check if slug is unique
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 409 }); // Conflict
    }

    // Prepare tag connections (upsert tags to avoid duplicates)
    const tagConnections = tagNames && Array.isArray(tagNames)
      ? await Promise.all(
          tagNames.map(async (name: string) => {
            const tag = await prisma.tag.upsert({
              where: { name: name.trim() },
              update: {},
              create: { name: name.trim() },
            });
            return { id: tag.id };
          })
        )
      : [];

    // Create the post
    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content: content, // Keep content as is (assume markdown/rich text)
        published: published ?? false, // Default to false if not provided
        tags: {
          connect: tagConnections, // Connect tags by their IDs
        },
        // Optional: Associate with author if User model is linked
        // authorId: userId, // Assuming you add an author relation later
      },
    });

    return NextResponse.json(newPost, { status: 201 }); // Return created post

  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}