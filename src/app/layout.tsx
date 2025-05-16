import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/nprogress.css"
import {AuthProvider} from "@/hooks/authContext";
import {Toaster} from "react-hot-toast";
import SocketProvider from "@/lib/socket";
import {HandleOnComplete} from "@/animation-router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skypipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <HandleOnComplete />
      <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
              style: { zIndex: 999999999 },
          }}
      />
      <AuthProvider>
          <SocketProvider />
          {children}
      </AuthProvider>
      </body>
    </html>
  );
}
