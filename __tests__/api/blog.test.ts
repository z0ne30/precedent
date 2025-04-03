import { GET } from '@/app/api/blog/route'; // Import the handler
import { prisma } from '@/lib/prisma'; // Import the actual prisma client instance
import { NextResponse } from 'next/server';

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findMany: jest.fn(), // Mock the findMany method
    },
  },
}));

// Helper to mock NextResponse.json
const mockJson = jest.fn();
jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => {
      mockJson(...args); // Call our mock
      // Return a simplified object for type checking if needed,
      // or just return the mock itself if types aren't strict
      return { status: args[1]?.status || 200, json: () => Promise.resolve(args[0]) };
    },
  },
}));


describe('GET /api/blog', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Type assertion needed because prisma is mocked
    (prisma.post.findMany as jest.Mock).mockReset();
    mockJson.mockReset();
  });

  it('should return published posts with tags', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', slug: 'post-1', published: true, createdAt: new Date(), tags: [{ name: 'Tech' }] },
      { id: 2, title: 'Post 2', slug: 'post-2', published: true, createdAt: new Date(), tags: [] },
    ];
    // Setup the mock implementation for findMany
    (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

    // Execute the handler
    // We don't need a real Request object for this simple GET handler
    await GET();

    // Assertions
    expect(prisma.post.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          select: { name: true },
        },
      },
    });
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({ posts: mockPosts });
    // We can't easily check status code here due to simplified mock
  });

   it('should return empty array if no posts found', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([]);

    await GET();

    expect(prisma.post.findMany).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({ posts: [] });
  });

  it('should handle errors during database fetch', async () => {
    const mockError = new Error('Database connection failed');
    (prisma.post.findMany as jest.Mock).mockRejectedValue(mockError);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    await GET();

    expect(prisma.post.findMany).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(
      { error: "Failed to fetch posts." },
      { status: 500 }
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch posts:", mockError); // Match actual error log

    consoleErrorSpy.mockRestore(); // Restore console.error
  });
});