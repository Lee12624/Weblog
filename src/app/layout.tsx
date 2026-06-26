import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Noto_Sans_SC, Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import NavLoader from "@/components/nav-loader";
import "./globals.css";

const mplusRounded = M_PLUS_Rounded_1c({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const notoSans = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lee | 梦回廊",
    template: "%s | 梦回廊",
  },
  description: "桜の舞う廊下で、思いを綴る —— 写代码，也做梦。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${mplusRounded.variable} ${notoSans.variable} ${notoSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NavLoader />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
