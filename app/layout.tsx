import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontClassName = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  title: "Daily Helper",
  description: "Let's make our start to the day more fun.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(fontClassName.className, "h-full")}>{children}</body>
    </html>
  );
}
