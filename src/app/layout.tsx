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
    images: [
      {
        url: "https://japanwise.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "JapanWise - AI-Powered Japan Travel Planner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JapanWise - AI-Powered Japan Travel Planner",
    description:
      "Plan your perfect Japan trip in seconds. Get personalized itineraries with local insights.",
    images: ["https://japanwise.jp/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "og:image": "https://japanwise.jp/og-image.png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:image": "https://japanwise.jp/og-image.png",
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
        <meta property="og:image" content="https://japanwise.jp/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://japanwise.jp/og-image.png" />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P6MFHKDX');
            `,
          }}
        />
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
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6MFHKDX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}