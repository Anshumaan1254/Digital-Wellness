import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteLoader } from "@/components/site/SiteLoader";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", axes: ["opsz"] });

export const metadata: Metadata = {
  title: {
    default: "Digital Wellness Hub — calm, practical tech tools for students",
    template: "%s · Digital Wellness Hub",
  },
  description:
    "Compare screen-time controls, focus tools, distraction blockers, bedtime routines and privacy tools. Honest costs, device compatibility and step-by-step setup guides for students.",
};

export const viewport: Viewport = {
  themeColor: "#0b1622",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        {/* the intro loader shows once per session; hide it before first paint on later loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('dw-loader-seen')==='1')document.documentElement.classList.add('dw-loader-seen')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen">
        <SiteLoader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-dawn focus:px-5 focus:py-3 focus:text-[#1b1410]"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
