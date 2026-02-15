import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "DevHire — Find Your Next Dev Role",
    template: "%s | DevHire",
  },
  description:
    "A job board for developers. Browse remote and on-site positions, filter by tech stack, and apply with one click.",
  keywords: [
    "developer jobs",
    "remote jobs",
    "software engineer",
    "React",
    "TypeScript",
    "Node.js",
    "full stack",
    "job board",
  ],
  openGraph: {
    title: "DevHire — Find Your Next Dev Role",
    description:
      "Search developer jobs by tech stack, experience level, and salary. Apply with one click.",
    type: "website",
    locale: "en_US",
    siteName: "DevHire",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevHire — Find Your Next Dev Role",
    description:
      "Search developer jobs by tech stack, experience level, and salary.",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
