import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server'; // Remove Clerk import
// import { getServerSession } from "next-auth/next"; // No longer needed directly
import { authOptions, requireAdminSession } from "@/lib/auth"; // Import helper
import { prisma } from '@/lib/prisma';
import { z } from 'zod'; // Import Zod

interface Params {
  params: { id: string };
}

// GET handler for fetching a single post by ID
export async function GET(request: Request, { params }: Params) {
  const postId = parseInt(params.id, 10);

  // Use the helper function for auth check
  const authResult = await requireAdminSession();
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response if auth failed/skipped handled by helper
  }
  // If auth passed (and wasn't skipped), authResult is the session object (or null if skipped)
  const session = authResult; // Can use session if needed later

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true, // Include related tags
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error(`Failed to fetch post ${postId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT handler for updating a post
export async function PUT(request: Request, { params }: Params) {
  const postId = parseInt(params.id, 10); // Ensure ID is an integer

  // Use the helper function for auth check
  const authResult = await requireAdminSession();
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response if auth failed/skipped handled by helper
  }
  // If auth passed (and wasn't skipped), authResult is the session object (or null if skipped)
  const session = authResult;

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }
  

  // TODO: Add role/permission check here if needed later

  // Define Zod schema for updating a post (all fields optional)
  const UpdatePostSchema = z.object({
    title: z.string().trim().min(1, { message: "Title cannot be empty." }).optional(),
    slug: z.string().trim().min(1, { message: "Slug cannot be empty." })
           // Optional regex: .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." })
           .optional(),
    content: z.string().optional(), // Allow empty content on update? Min(1) if not.
    published: z.boolean().optional(),
    tagNames: z.array(z.string().trim().min(1)).optional(), // Allow optional array of non-empty strings
  });

  try {
    const body = await request.json();

    // Validate input using Zod
    const validationResult = UpdatePostSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(e => e.message).join(' ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Use validated and typed data
    const { title, slug, content, published, tagNames } = validationResult.data;

    // Check if any data was actually provided for update
    if (Object.keys(validationResult.data).length === 0) {
       return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    // Check if slug is being updated and if the new one is unique (excluding the current post)
    if (slug) {
      const existingPost = await prisma.post.findUnique({ where: { slug } });
      if (existingPost && existingPost.id !== postId) {
        return NextResponse.json({ error: 'Slug must be unique' }, { status: 409 });
      }
    }

    // Prepare tag connections (upsert tags and create connect/disconnect structure)
    let tagOperations = {};
    // Prepare tag connections only if tagNames is provided in the update
    if (tagNames !== undefined) { // Check if the key exists in the validated data
      const newTags = await Promise.all(
        tagNames.map(async (name: string) => { // name is guaranteed non-empty string
          const tag = await prisma.tag.upsert({
            where: { name: name }, // Already trimmed by Zod
            update: {},
            create: { name: name },
          });
          return { id: tag.id };
        })
      );
      // Use 'set' to replace all existing tags with the new set
      tagOperations = { tags: { set: newTags } };
    }
    // Note: If tagNames is omitted from the request body, tags remain unchanged.
    // If you want to allow removing all tags, the client should send tagNames: []

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        // Use validated data, only include fields present in the validated data
        ...(title !== undefined && { title: title }), // Already trimmed
        ...(slug !== undefined && { slug: slug }),   // Already trimmed
        ...(content !== undefined && { content: content }),
        ...(published !== undefined && { published: published }),
        ...tagOperations, // Apply tag changes if tagNames was provided
        // Optional: Ensure only the author can update if relation exists
        // authorId: userId,
      },
      include: {
        tags: true, // Ensure tags are returned after update
      },
    });

    return NextResponse.json(updatedPost);

  } catch (error: any) {
    console.error(`Failed to update post ${postId}:`, error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE handler for deleting a post
export async function DELETE(request: Request, { params }: Params) {
  const postId = parseInt(params.id, 10);

  // Use the helper function for auth check
  const authResult = await requireAdminSession();
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response if auth failed/skipped handled by helper
  }
  // If auth passed (and wasn't skipped), authResult is the session object (or null if skipped)
  const session = authResult;

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  // TODO: Add role/permission check here if needed later

  try {
    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
        // Optional: Ensure only the author can delete if relation exists
        // authorId: userId,
      },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 }); // Or 204 No Content

  } catch (error: any) {
    console.error(`Failed to delete post ${postId}:`, error);
     if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}