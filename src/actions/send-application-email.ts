import { action } from "@/lib/safe-action";
import { z } from "zod";
import { Resend } from "resend";
import ApplicationEmail from "emails/application-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
  applicationUrl: z.string().url(),
});

export const sendApplicationEmail = action(schema, async ({ email, applicationUrl }) => {
  try {
    await resend.emails.send({
      from: "Your App <noreply@yourdomain.com>",
      to: email,
      subject: "Application Link",
      text: `Click the link to apply: ${applicationUrl}`, 
      react: ApplicationEmail({ applicationUrl }),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
});