import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classitivity — Multi-Curriculum Education Platform",
  description:
    "Empowering teachers with structured lesson plans, PowerPoint slides, and downloadable resources across Nigerian, UK, US, and Australian curricula. Start your 3-day free trial today.",
  keywords: [
    "education platform",
    "lesson plans",
    "teacher resources",
    "Nigerian curriculum",
    "UK curriculum",
    "US curriculum",
    "Australian curriculum",
    "SaaS education",
    "school management",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Classitivity — Multi-Curriculum Education Platform",
    description:
      "Structured lesson resources for teachers across 4 curriculum regions. Plans, slides, notes, and assessments — all in one place.",
    type: "website",
    url: "https://classitivity.io",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Inline script to prevent FOUC — sets class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('classitivity-theme') || 'system';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-800 dark:text-surface-200 font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
