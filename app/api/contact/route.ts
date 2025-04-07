import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend'; // Import Resend

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
if (!resend) {
  console.warn("RESEND_API_KEY not found in environment variables. Email sending will be disabled.");
}

// Basic validation (can be expanded)
function validateInput(data: any) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    return 'Name is required.';
  }
  if (!data.email || typeof data.email !== 'string' || !/\S+@\S+\.\S+/.test(data.email)) {
    return 'Valid email is required.';
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
    return 'Message is required.';
  }
  return null; // No errors
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validate input
    const validationError = validateInput(formData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // --- Save to database ---
    const submission = await prisma.contactSubmission.create({
      data: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      },
    });
    console.log("Contact submission saved:", submission.id);

    // --- Send Emails ---
    if (resend) { // Only attempt if Resend client is initialized
      const senderName = "Enyu Rao"; // Replace with your name or site name
      const senderEmail = "enyu@launchyard.xyz"; // Verified sender email
      const userName = formData.name.trim();
      const userEmail = formData.email.trim();
      const userMessage = formData.message.trim();
      const notificationRecipient = "enyu@launchyard.xyz"; // Your notification email

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