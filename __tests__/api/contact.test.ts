// Removed duplicate import
// Import the module to be tested AFTER mocking dependencies
// import { prisma } from '@/lib/prisma'; - Mocked below
// import { Resend } from 'resend'; - Mocked below
import { NextResponse } from 'next/server';

// --- Mock Dependencies ---
// Mock the entire prisma module structure
jest.mock('@/lib/prisma', () => ({
  prisma: {
    contactSubmission: {
      // We will assign the mock function in beforeEach
      create: jest.fn(),
    },
  },
}));

// Mock the entire resend module structure
const mockSendImplementation = jest.fn(); // Keep this separate
const mockResendInstance = {
  emails: { send: mockSendImplementation },
};
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => mockResendInstance),
}));

// Mock NextResponse
const mockJson = jest.fn();
jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => {
      mockJson(...args);
      return { args };
    },
  },
}));


// Import the function AFTER mocks are set up
// Import the function AFTER mocks are set up
import { POST } from '@/app/api/contact/route';
// Import the mocked modules to access the mocks
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

describe('POST /api/contact', () => {
  beforeEach(() => {
    // Get the mock function from the imported module
    const mockedPrismaCreateFn = prisma.contactSubmission.create as jest.Mock;

    // Reset mocks
    mockedPrismaCreateFn.mockClear();
    mockSendImplementation.mockClear();
    (Resend as jest.Mock).mockClear(); // Clear constructor calls
    mockJson.mockClear();

    // Assign default implementations to the mocks *within* beforeEach
    mockedPrismaCreateFn.mockResolvedValue({
      id: 1, name: 'Test User', email: 'test@example.com', message: 'Test message', createdAt: new Date(),
    });
    mockSendImplementation.mockResolvedValue({ data: { id: 'resend-id' }, error: null });
  });

  it('should return 400 if name is missing', async () => {
    const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Test message' }),
      headers: { 'Content-Type': 'application/json' },
    });

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Name is required.' }, { status: 400 });
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled();
    expect(mockSendImplementation).not.toHaveBeenCalled();
  });

  it('should return 400 if email is invalid', async () => {
    const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'invalid-email', message: 'Test message' }),
      headers: { 'Content-Type': 'application/json' },
    });

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Valid email is required.' }, { status: 400 });
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled();
    expect(mockSendImplementation).not.toHaveBeenCalled();
  });

   it('should return 400 if message is missing', async () => {
    const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', message: ' ' }), // Empty message
      headers: { 'Content-Type': 'application/json' },
    });

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Message is required.' }, { status: 400 });
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled();
    expect(mockSendImplementation).not.toHaveBeenCalled();
  });


  it('should save submission and send emails on valid input', async () => {
    const validData = { name: ' Test User ', email: ' test@example.com ', message: ' Test Message ' };
    const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' },
    });

    // Mock Resend API key to ensure email sending is attempted
    process.env.RESEND_API_KEY = 'test-key';

    await POST(mockRequest);

    // Check if saved to DB with trimmed data
    expect(prisma.contactSubmission.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test Message',
      },
    });

    // Check if confirmation email was sent
    expect(mockSendImplementation).toHaveBeenCalledWith(expect.objectContaining({
      to: ['test@example.com'],
      subject: expect.stringContaining('Got your message!'),
    }));

    // Check if notification email was sent
    expect(mockSendImplementation).toHaveBeenCalledWith(expect.objectContaining({
      to: [expect.any(String)], // Check recipient is present (actual value depends on env)
      subject: expect.stringContaining('New Contact Form Submission'),
    }));

    // Check for success response
    expect(mockJson).toHaveBeenCalledWith({ message: 'Submission received' });

    // Clean up env var
     delete process.env.RESEND_API_KEY;
  });

  it('should return 500 if database save fails', async () => {
     const validData = { name: 'Test User', email: 'test@example.com', message: 'Test Message' };
     const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' },
    });

    // Mock Prisma failure
    const dbError = new Error('Database connection failed');
    (prisma.contactSubmission.create as jest.Mock).mockRejectedValue(dbError); // Use the correct mock variable

    await POST(mockRequest);

    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1);
    expect(mockSendImplementation).not.toHaveBeenCalled(); // Emails should not be sent if DB fails
    expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to process submission.' }, { status: 500 });
  });

   it('should return success even if confirmation email fails', async () => {
     const validData = { name: 'Test User', email: 'test@example.com', message: 'Test Message' };
     const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' },
    });
     process.env.RESEND_API_KEY = 'test-key';

    // Mock first email send to fail, second to succeed
    mockSendImplementation // Correct variable name
      .mockResolvedValueOnce({ data: null, error: { message: 'Failed to send', name: 'Test Error' } }) // Fail confirmation
      .mockResolvedValueOnce({ data: { id: 'resend-id-2' }, error: null }); // Succeed notification

    await POST(mockRequest);

    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1);
    expect(mockSendImplementation).toHaveBeenCalledTimes(2); // Both emails attempted
    expect(mockJson).toHaveBeenCalledWith({ message: 'Submission received' }); // Still returns success

    delete process.env.RESEND_API_KEY;
  });

   it('should return success even if notification email fails', async () => {
     const validData = { name: 'Test User', email: 'test@example.com', message: 'Test Message' };
     const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' },
    });
     process.env.RESEND_API_KEY = 'test-key';

    // Mock first email send to succeed, second to fail
    mockSendImplementation // Correct variable name
      .mockResolvedValueOnce({ data: { id: 'resend-id-1' }, error: null }) // Succeed confirmation
      .mockResolvedValueOnce({ data: null, error: { message: 'Failed to send', name: 'Test Error' } }); // Fail notification

    await POST(mockRequest);

    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1);
    expect(mockSendImplementation).toHaveBeenCalledTimes(2); // Both emails attempted
    expect(mockJson).toHaveBeenCalledWith({ message: 'Submission received' }); // Still returns success

    delete process.env.RESEND_API_KEY;
  });

   it('should not attempt to send emails if RESEND_API_KEY is missing', async () => {
     const validData = { name: 'Test User', email: 'test@example.com', message: 'Test Message' };
     const mockRequest = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' },
    });

    // Ensure Resend API key is not set
    delete process.env.RESEND_API_KEY;
    // We need to re-evaluate the module scope where Resend is initialized
    // This is tricky in Jest. A cleaner way might involve dependency injection
    // or re-importing the module, but for now, we rely on the check within POST.

    await POST(mockRequest);

    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1);
    expect(mockSendImplementation).not.toHaveBeenCalled(); // Emails should not be attempted
    expect(mockJson).toHaveBeenCalledWith({ message: 'Submission received' });
  });

});