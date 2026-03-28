import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ansh Singh - Full Stack Developer | React, Next.js, React Native",
  description:
    "Ansh Singh is a Full Stack Developer specializing in React, Next.js, React Native, Node.js. Explore projects, including mobile apps, cloud-based solutions, and real-time systems.",
  keywords: [
    "Ansh Singh",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "React Native Developer",
    "Node.js Developer",
    "IoT Developer",
    "Portfolio",
  ],
  openGraph: {
    title: "Ansh Singh | Full Stack Developer",
    description:
      "Portfolio showcasing full stack, mobile, and IoT projects built with modern technologies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
