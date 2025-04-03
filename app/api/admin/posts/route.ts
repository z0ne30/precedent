import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Import server-side auth
import { prisma } from '@/lib/prisma';

// POST handler for creating a new post
export async function POST(request: Request) {
  const { userId } = auth(); // Get user ID from Clerk

  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Add role/permission check here if needed later

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