import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BeneficiaryConfirmationEmailProps {
  confirmationLink?: string;
  benefactorName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const BeneficiaryConfirmationEmail = ({
  confirmationLink,
  benefactorName,
}: BeneficiaryConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your status as a beneficiary.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/will-logo.png`}
          width={48}
          height={48}
          alt="Will Confirmation"
        />
        <Heading style={heading}>📜 Beneficiary Confirmation</Heading>
        <Section style={body}>
          <Text style={paragraph}>Hello,</Text>
          <Text style={paragraph}>
            You have been identified as a potential beneficiary for{" "}
            <strong>{benefactorName}</strong>. To confirm this status, please
            use the link below:
          </Text>
          <Text style={paragraph}>
            <Link style={link} href={confirmationLink}>
              👉 Confirm your status 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            If you believe this is a mistake, please disregard this email.
          </Text>
        </Section>
        <Text style={paragraph}>
          Sincerely,
          <br />- Estate Planning Team
        </Text>
        <Hr style={hr} />
        <Img
          src={`${baseUrl}/static/will-logo.png`}
          width={32}
          height={32}
          style={{
            WebkitFilter: "grayscale(100%)",
            filter: "grayscale(100%)",
            margin: "20px 0",
          }}
        />
        <Text style={footer}>Estate Planning Services</Text>
        <Text style={footer}>1234 Legacy Drive, YourCity, YC 12345</Text>
      </Container>
    </Body>
  </Html>
);

BeneficiaryConfirmationEmail.PreviewProps = {
  confirmationLink: "https://example.com/confirm",
  benefactorName: "John Doe",
} as BeneficiaryConfirmationEmailProps;

export default BeneficiaryConfirmationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundColor: "#f9f9f9",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "24px",
  textAlign: "center" as "center", // Explicit casting
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#4CAF50",
  textDecoration: "none",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as "center",
};
