import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BMW NEXUS — The Future of Intelligent Mobility",
  description:
    "An ultra-premium, futuristic automotive website experience for the BMW NEXUS Hyper-EV concept. Luxury Meets Intelligence.",
  keywords: ["BMW", "NEXUS", "Electric Vehicle", "Hyper-EV", "Automotive UI", "Future Mobility"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jakarta.variable} ${spaceGrotesk.variable} font-sans bg-brand-black text-slate-100 antialiased selection:bg-brand-cyan selection:text-black min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
