import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "JapanWise - AI-Powered Japan Travel Planner",
  description:
    "Plan your perfect Japan trip in seconds. Get personalized itineraries with local insights, restaurant recommendations, and travel tips.",
  keywords: [
    "Japan travel",
    "Japan itinerary",
    "Japan trip planner",
    "Tokyo travel",
    "Kyoto travel",
    "Japan vacation",
    "AI travel planner",
  ],
  openGraph: {
    title: "JapanWise - AI-Powered Japan Travel Planner",
    description:
      "Plan your perfect Japan trip in seconds. Get personalized itineraries with local insights.",
    url: "https://japanwise.jp",
    siteName: "JapanWise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JapanWise - AI-Powered Japan Travel Planner",
    description:
      "Plan your perfect Japan trip in seconds. Get personalized itineraries with local insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BM202SZQDR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BM202SZQDR');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}