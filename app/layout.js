import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "PlaceVault",
  description: "placement materials for career seekers.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NotificationProvider } from "@/components/NotificationSystem";
import { ChatProvider } from "@/components/ChatContext";
import CareerBot from "@/components/CareerBot";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NotificationProvider>
          <ChatProvider>
            <div className="noise-overlay" />
            <Navbar />
            {children}
            <Analytics />
            <CareerBot />
            <Footer />
          </ChatProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
