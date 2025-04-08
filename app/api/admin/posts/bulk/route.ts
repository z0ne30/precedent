import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from "@/lib/auth"; // Import helper
import { z } from 'zod';

// Define Zod schema for bulk actions
const BulkActionSchema = z.object({
  action: z.enum(['publish', 'unpublish', 'delete']),
  ids: z.array(z.number().int().positive()).min(1, { message: "At least one post ID is required." }),
});

export async function POST(request: Request) {
  // 1. Authenticate and authorize admin
  const authResult = await requireAdminSession();
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response if auth failed
  }
  // const session = authResult; // Session object available if needed

  try {
    const body = await request.json();

    // 2. Validate input using Zod
    const validationResult = BulkActionSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(e => e.message).join(' ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { action, ids } = validationResult.data;

    let result;

    // 3. Perform action based on validated data
    switch (action) {
      case 'publish':
        result = await prisma.post.updateMany({
          where: { id: { in: ids } },
          data: { published: true },
        });
        break;
      case 'unpublish':
        result = await prisma.post.updateMany({
          where: { id: { in: ids } },
          data: { published: false },
        });
        break;
      case 'delete':
        result = await prisma.post.deleteMany({
          where: { id: { in: ids } },
        });
        break;
      default:
        // Should not happen due to Zod enum validation, but good practice
        return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
    }

    // 4. Return success response
    return NextResponse.json({ message: `Successfully performed ${action} on ${result.count} post(s).`, count: result.count });

  } catch (error) {
    console.error(`Failed to perform bulk action:`, error);
    return NextResponse.json({ error: 'Failed to perform bulk action.' }, { status: 500 });
  }
}