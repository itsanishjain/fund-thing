import { BeneficiaryConfirmationEmail } from "@/components/app/BeneficiaryConfirmationEmail";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "willi-noreply@appstronauts.shop",
      to: [body.to],
      subject: "Willi Smart Wallet",
      react: BeneficiaryConfirmationEmail({
        benefactorName: body.accountWalletAddress,
        confirmationLink: body.confirmationLink,
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
