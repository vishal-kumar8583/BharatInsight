import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Bharat Insight – AI-Driven Data Platform",
  description:
    "India's most powerful multi-tenant analytics platform powered by public data and Gemini AI.",
  keywords: ["India", "analytics", "AI", "data", "government", "insights"],
  openGraph: {
    title: "Bharat Insight",
    description: "AI-Driven Analytics Platform for Indian Public Data",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration = 'manual';" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
