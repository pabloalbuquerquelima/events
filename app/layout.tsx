import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Topbar from "../components/topbar";
import "./globals.css";
import Footer from "@/components/footer";
import WhatsAppFloatingButton from "@/components/whatsApp-floating-button";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEDUC - Prefeitura de Coreaú",
  description:
    "Site oficial da Secretaria de Educação da Prefeitura de Coreaú, Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <Topbar />
            <WhatsAppFloatingButton />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
