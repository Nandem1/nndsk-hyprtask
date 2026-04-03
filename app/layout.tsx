import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/shared/theme";
import { QueryProvider } from "@/shared/lib/query-client";
import { Toaster } from "@/shared/ui/sonner";
import { ConfirmProvider } from "@/shared/hooks/use-confirm";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HyprTasks - Control de Sueno y Tareas",
  description: "Sistema de gestion de tareas y control inteligente de sueno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <ConfirmProvider>
              {children}
              <Toaster position="bottom-right" />
            </ConfirmProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
