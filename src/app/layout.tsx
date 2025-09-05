import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Prime Steel - Employee Verification System",
  description: "Official employee verification portal for Prime Steel. Verify employee credentials with confidence.",
  keywords: ["Prime Steel", "Employee Verification", "QR Code", "Authentication"],
  authors: [{ name: "Prime Steel" }],
  openGraph: {
    title: "Prime Steel - Employee Verification System",
    description: "Official employee verification portal for Prime Steel",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
