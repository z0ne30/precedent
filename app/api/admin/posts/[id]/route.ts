import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// PUT handler for updating a post
export async function PUT(request: Request, { params }: Params) {
  const { userId } = auth();
  const postId = parseInt(params.id, 10); // Ensure ID is an integer

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  // TODO: Add role/permission check here if needed later

  try {
    const body = await request.json();
    // Allow updating title, slug, content, published status, and tags
    const { title, slug, content, published, tagNames } = body;

    // Basic validation (optional, depends on required fields for update)
    // if (!title || !slug || !content) { ... }

    // Check if slug is being updated and if the new one is unique (excluding the current post)
    if (slug) {
      const existingPost = await prisma.post.findUnique({ where: { slug } });
      if (existingPost && existingPost.id !== postId) {
        return NextResponse.json({ error: 'Slug must be unique' }, { status: 409 });
      }
    }

    // Prepare tag connections (upsert tags and create connect/disconnect structure)
    let tagOperations = {};
    if (tagNames && Array.isArray(tagNames)) {
      const newTags = await Promise.all(
        tagNames.map(async (name: string) => {
          const tag = await prisma.tag.upsert({
            where: { name: name.trim() },
            update: {},
            create: { name: name.trim() },
          });
          return { id: tag.id };
        })
      );
      // Use 'set' to replace all existing tags with the new set
      tagOperations = { tags: { set: newTags } };
    } else if (tagNames === null || tagNames === undefined) {
      // If tagNames is explicitly null/undefined, potentially disconnect all tags
      // tagOperations = { tags: { set: [] } }; // Uncomment to allow removing all tags
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title: title.trim() }),
        ...(slug && { slug: slug.trim() }),
        ...(content && { content: content }),
        ...(published !== undefined && { published: published }), // Allow setting true/false
        ...tagOperations,
        // Optional: Ensure only the author can update if relation exists
        // authorId: userId,
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
  const { userId } = auth();
  const postId = parseInt(params.id, 10);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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