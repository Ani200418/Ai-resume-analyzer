import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Resume Analyzer | Beat the ATS & Land Your Dream Job",
  description: "Upload your resume and get instant ATS score, skill gap analysis, AI-powered feedback, and personalized job recommendations.",
  keywords: ["resume analyzer", "ATS score", "job matcher", "career tools", "AI resume"],
  openGraph: {
    title: "AI Resume Analyzer & Job Matcher",
    description: "Beat the ATS. Land your dream job.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-surface-950 text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1d27",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "var(--font-sora)",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#f1f5f9" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" } },
          }}
        />
      </body>
    </html>
  );
}
