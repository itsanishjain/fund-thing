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

interface CheckInNotificationEmailProps {
  checkInLink?: string;
  userName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const CheckInNotificationEmail = ({
  checkInLink,
  userName,
}: CheckInNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Reminder: Just checking in!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/checkin-logo.png`}
          width={48}
          height={48}
          alt="Check In Reminder"
        />
        <Heading style={heading}>💬 Just Checking In!</Heading>
        <Section style={body}>
          <Text style={paragraph}>Hey there, {userName || "Friend"}!</Text>
          <Text style={paragraph}>
            We just wanted to check if you're still with us! Are you alive and
            kicking? 😄 If so, please confirm by clicking the link below:
          </Text>
          <Text style={paragraph}>
            <Link style={link} href={checkInLink}>
              👉 Check In Now 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            If you're good, no action needed, but we would love to hear from
            you!
          </Text>
        </Section>
        <Text style={paragraph}>
          Cheers,
          <br />- Your Friendly Team
        </Text>
        <Hr style={hr} />
        <Img
          src={`${baseUrl}/static/checkin-logo.png`}
          width={32}
          height={32}
          style={{
            WebkitFilter: "grayscale(100%)",
            filter: "grayscale(100%)",
            margin: "20px 0",
          }}
        />
        <Text style={footer}>Friendly Reminder Service</Text>
        <Text style={footer}>1234 Connection Ave, YourCity, YC 12345</Text>
      </Container>
    </Body>
  </Html>
);

CheckInNotificationEmail.PreviewProps = {
  checkInLink: "https://example.com/check-in",
  userName: "John Doe",
} as CheckInNotificationEmailProps;

export default CheckInNotificationEmail;

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
