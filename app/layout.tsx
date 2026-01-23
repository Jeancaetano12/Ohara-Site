import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "./_context/ThemeContext";
import { AuthProvider } from "../app/_context/AuthContext"

export const metadata: Metadata = {
  title: "Comunidade Ohara",
  description: "Site oficial da comunidade Ohara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning é necessário para evitar erro de mismatch do tema no carregamento
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-ohara-white dark:bg-ohara-dark text-ohara-dark dark:text-ohara-white transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}