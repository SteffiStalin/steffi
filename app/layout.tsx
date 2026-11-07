import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://steffistalin.github.io/portfolio-website";

export const metadata: Metadata = {
  metadataBase: new URL("https://steffistalin.github.io"),
  title: {
    default: "Steffi Stalin — Front-End Web Developer & Creative Engineer",
    template: "%s | Steffi Stalin",
  },
  description:
    "Portfolio of Steffi Stalin, an Electronics & Communication Engineering graduate crafting high-performance, responsive websites with smooth animations, Next.js, Three.js, GSAP, and tactile UI engineering.",
  keywords: [
    "Steffi Stalin",
    "Steffi Stalin S",
    "Front-End Web Developer",
    "Creative Web Engineer",
    "React Developer",
    "Next.js Portfolio",
    "GSAP Animation",
    "Three.js WebGL",
    "UI/UX Design Engineer",
    "JavaScript Developer",
    "TypeScript",
    "Web Developer Chennai",
    "ECE Graduate Portfolio",
  ],
  authors: [{ name: "Steffi Stalin", url: siteUrl }],
  creator: "Steffi Stalin",
  publisher: "Steffi Stalin",
  applicationName: "Steffi Stalin Portfolio",
  generator: "Next.js",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Steffi Stalin Portfolio",
    title: "Steffi Stalin — Front-End Web Developer & Creative Engineer",
    description:
      "Crafting tactile, high-performance web experiences with Next.js, Three.js, GSAP animation, and clean interface engineering.",
    images: [
      {
        url: "/flower.jpeg",
        width: 1200,
        height: 630,
        alt: "Steffi Stalin — Front-End Web Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steffi Stalin — Front-End Web Developer & Creative Engineer",
    description:
      "Crafting tactile, high-performance web experiences with Next.js, Three.js, GSAP animation, and clean interface engineering.",
    images: ["/flower.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%2366c1ea'/%3E%3Ctext x='50' y='70' font-size='64' text-anchor='middle'%3E%E2%9C%BA%3C/text%3E%3C/svg%3E",
    apple: "/flower.jpeg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Steffi Stalin",
      jobTitle: "Front-End Web Developer",
      url: siteUrl,
      email: "steffistalin25@gmail.com",
      image: `${siteUrl}/flower.jpeg`,
      sameAs: [
        "https://www.linkedin.com/in/steffi-stalin-s-317721280",
        "https://github.com/SteffiStalin/desktop-tutorial",
      ],
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Panimalar Engineering College",
          description: "MBA (2026 — Present, Currently Pursuing)",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "St. Joseph’s College of Engineering",
          sameAs: "https://www.annauniv.edu",
        },
      ],
      knowsAbout: [
        "Front-End Web Development",
        "React",
        "Next.js",
        "JavaScript",
        "TypeScript",
        "GSAP (GreenSock Animation Platform)",
        "Three.js",
        "WebGL",
        "Responsive Web Design",
        "Python",
        "Convolutional Neural Networks",
        "Arduino & Embedded Systems",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Steffi Stalin Portfolio",
      description:
        "Portfolio of Steffi Stalin, front-end developer building clean, responsive websites with smooth animations and tactile interactions.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Space+Mono:wght@400;700&family=Caveat:wght@600&family=Inter:wght@400;500;600;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
