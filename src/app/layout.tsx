import type { Metadata } from "next";
import { Inter, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Whereto.edu — Discover Your Perfect College",
    template: "%s | Whereto.edu",
  },
  description:
    "Search and compare 35+ premier Indian colleges. Filter by location, fees, and ratings. Make your most important academic decision with confidence.",
  keywords: ["college search India", "college comparison", "IIT NIT colleges", "engineering admissions India"],
  icons: {
    icon: "/whereto_edu_logo.png",
    apple: "/whereto_edu_logo.png",
  },
  openGraph: {
    title: "Whereto.edu — Discover Your Perfect College",
    description: "Search, compare, and shortlist the best Indian colleges for your future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-background font-inter text-slate-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
