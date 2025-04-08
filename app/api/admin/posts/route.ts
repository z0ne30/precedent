import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server'; // Remove Clerk import
// import { getServerSession } from "next-auth/next"; // No longer needed directly here
import { authOptions, requireAdminSession } from "@/lib/auth"; // Import helper
import { prisma } from '@/lib/prisma';
import { z } from 'zod'; // Import Zod

// GET handler for fetching all posts (for admin list)
export async function GET(request: Request) {
  // Use the helper function for auth check
  const authResult = await requireAdminSession();
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response if auth failed/skipped handled by helper
  }
  // If auth passed (and wasn't skipped), authResult is the session object (or null if skipped)
  const session = authResult; // Can use session if needed later

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
  // Use the helper function for auth check
  const authResult = await requireAdminSession();
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response if auth failed/skipped handled by helper
  }
  // If auth passed (and wasn't skipped), authResult is the session object (or null if skipped)
  const session = authResult;
  // TODO: If associating posts with users, use session?.user?.id;
  // const userId = session?.user?.id;

  // Define Zod schema for creating a post
  const CreatePostSchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required." }),
    slug: z.string().trim().min(1, { message: "Slug is required." })
           // Add regex for basic slug format if desired: .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." })
           ,
    content: z.string().min(1, { message: "Content is required." }),
    published: z.boolean().optional().default(false),
    tagNames: z.array(z.string().trim().min(1)).optional().default([]), // Expect array of non-empty strings
  });

  try {
    const body = await request.json();

    // Validate input using Zod
    const validationResult = CreatePostSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(e => e.message).join(' ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Use validated and typed data
    const { title, slug, content, published, tagNames } = validationResult.data;

    // Check if slug is unique
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 409 }); // Conflict
    }

    // Prepare tag connections (upsert tags using validated tagNames)
    const tagConnections = await Promise.all(
      tagNames.map(async (name: string) => { // name is guaranteed to be a non-empty string here
        const tag = await prisma.tag.upsert({
          where: { name: name }, // Already trimmed by Zod
          update: {},
          create: { name: name },
        });
        return { id: tag.id };
      })
    );

    // Create the post
    const newPost = await prisma.post.create({
      data: {
        title: title, // Already trimmed by Zod
        slug: slug,   // Already trimmed by Zod
        content: content,
        published: published, // Zod provides default
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