import { CheckInNotificationEmail } from "@/components/app/CheckInNotificationEmail";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "willi-noreply@appstronauts.shop",
      to: [body.to],
      subject: "Curious, are you still not dead",
      react: CheckInNotificationEmail({
        checkInLink: body.checkInLink,
        userName: body.name,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
