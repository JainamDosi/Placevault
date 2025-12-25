import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "PlaceVault | High-Performance Placement Prep",
  description: "Mission-critical placement materials for career seekers.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NotificationProvider } from "@/components/NotificationSystem";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NotificationProvider>
          <div className="noise-overlay" />
          <Navbar />
          {children}
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
