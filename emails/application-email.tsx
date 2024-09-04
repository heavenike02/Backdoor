import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,

} from "@react-email/components";
import * as React from "react";

interface ApplicationEmailProps {
  applicationUrl: string;
  applicantName: string;
}

export const ApplicationEmail: React.FC<ApplicationEmailProps> = ({
  applicationUrl,
  applicantName,
}) => (
  <Html>
    <Head />
    <Preview>Your application link is ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Application Link</Heading>
        
        <Text style={text}>
        Hi {applicantName},
          You've been invited to apply to a property on Backdoor. Click the button below to access your application:
        </Text>
        <Section style={buttonContainer}>
          <Button
          style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
       
            
            href={applicationUrl}
          >
            Open Application
          </Button>
        </Section>
        <Text style={text}>
          If the button doesn't work, you can copy and paste this link into your browser:
        </Text>
        <Text style={link}>{applicationUrl}</Text>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "4px",
  color: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const link = {
  color: "#5469d4",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "14px",
  textAlign: "center" as const,
  textDecoration: "underline",
};

export default ApplicationEmail;