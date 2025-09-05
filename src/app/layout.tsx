import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

// سیٹنگز کو ابتدائی طور پر لوڈ کرنے کے لیے
async function getInitialSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://primeverification.vercel.app'}/api/public/settings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // ہر بار تازہ ڈیٹا لائیں
    });

    if (res.ok) {
      const data = await res.json();
      return data.settings;
    }
  } catch (error) {
    console.error('Failed to load settings in layout:', error);
  }

  // ڈیفالٹ سیٹنگز
  return {
    companyName: 'Prime Steel Industries',
    companyLogo: null,
    companyAddress: 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
    companyPhone: '091-XXXXXXX',
    companyEmail: 'support@primesteel.com',
  };
}

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getInitialSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {/* چھپے ہوئے ڈیٹا ٹیگ — پیج کو سیٹنگز فوری دستیاب ہوں گی */}
        <div 
          id="initial-settings" 
          style={{ display: 'none' }} 
          data-settings={JSON.stringify(settings)}
        />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
