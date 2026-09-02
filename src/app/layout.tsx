import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Varn — Local filesystem checkpoint & rollback",
  description:
    "Varn captures a known state of your local filesystem, shows you exactly what changed, and safely restores it. Built for AI agents and automated tools. Linux, macOS, Windows.",
  openGraph: {
    title: "Varn — Local filesystem checkpoint & rollback",
    description:
      "Capture filesystem state, observe what changed, restore safely. Built for AI agents and automated tools.",
    type: "website",
    url: "https://varn.flawme.sbs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
