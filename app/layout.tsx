import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Steffi Stalin — Front-End Web Developer | Responsive Websites, JavaScript & Animation",
  description:
    "Portfolio of Steffi Stalin, a front-end web developer building clean, responsive websites with smooth animations, interactive web apps, and modern design.",
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%2366c1ea'/%3E%3Ctext x='50' y='70' font-size='64' text-anchor='middle'%3E%E2%9C%BA%3C/text%3E%3C/svg%3E",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
