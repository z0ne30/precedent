import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend'; // Import Resend
import { z } from 'zod'; // Import Zod

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
if (!resend) {
  console.warn("RESEND_API_KEY not found in environment variables. Email sending will be disabled.");
}

// Define Zod schema for validation
const ContactFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Valid email is required." }),
  message: z.string().trim().min(1, { message: "Message is required." }),
});

// Define type based on schema
type ContactFormData = z.infer<typeof ContactFormSchema>;

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validate input using Zod
    const validationResult = ContactFormSchema.safeParse(formData);
    if (!validationResult.success) {
      // Combine potential multiple errors into a single message string
      const errorMessage = validationResult.error.errors.map(e => e.message).join(' ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Use validated and typed data from now on
    const validatedData: ContactFormData = validationResult.data;

    // --- Save to database ---
    const submission = await prisma.contactSubmission.create({
      data: {
        // Use validated data (already trimmed by schema)
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
      },
    });
    console.log("Contact submission saved:", submission.id);

    // --- Send Emails ---
    if (resend) { // Only attempt if Resend client is initialized
      // TODO: Move these to environment variables or constants
      const senderName = process.env.CONTACT_SENDER_NAME || "Enyu Rao";
      const senderEmail = process.env.CONTACT_SENDER_EMAIL || "enyu@launchyard.xyz"; // Should be verified with Resend
      const notificationRecipient = process.env.CONTACT_NOTIFICATION_EMAIL || "enyu@launchyard.xyz";

      // Use validated data
      const userName = validatedData.name;
      const userEmail = validatedData.email;
      const userMessage = validatedData.message;

      // Send Confirmation Email to User
      try {
        const { data, error } = await resend.emails.send({
          from: `${senderName} <${senderEmail}>`,
          to: [userEmail],
          subject: `Got your message! ✨`,
          text: `Hey ${userName}!\n\nThanks for getting in touch. I've got your message and will get back to you soon!\n\nCheers,\n${senderName}`,
          html: `
            <p>Hey <strong>${userName}</strong>!</p>
            <p>Thanks for getting in touch. I've got your message and will get back to you soon!</p>
            <p>Cheers,<br/>${senderName}</p>
          `,
        });

        if (error) {
          console.error("Resend failed to send confirmation email:", error);
        } else {
          console.log(`Confirmation email sent successfully to ${userEmail}:`, data);
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }

      // Send Notification Email to Yourself
      try {
        const { data, error } = await resend.emails.send({
          from: `Website Contact Form <${senderEmail}>`, // Can customize 'from' name
          to: [notificationRecipient],
          subject: `New Contact Form Submission from ${userName}`,
          // Include submission details in the notification
          text: `New submission received:\n\nName: ${userName}\nEmail: ${userEmail}\n\nMessage:\n${userMessage}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${userMessage.replace(/\n/g, '<br>')}</p> 
          `, // Basic HTML formatting for notification
        });

        if (error) {
          console.error("Resend failed to send notification email:", error);
        } else {
          console.log(`Notification email sent successfully to ${notificationRecipient}:`, data);
        }
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
      }

    } else {
      console.log("Resend not configured, skipping emails.");
    }
    // -----------------------------

    // Return success response regardless of email outcome
    return NextResponse.json({ message: 'Submission received' });

  } catch (error) {
    console.error("Failed to process contact submission:", error);
    // Return generic server error
    return NextResponse.json(
      { error: "Failed to process submission." },
      { status: 500 }
    );
  }
}