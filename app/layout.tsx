import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

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
      <body className={cn(fontClassName.className, "h-full")}>
        {children}
        <Toaster />

        <footer className="bg-neutral-900 text-neutral-500 py-8 text-center flex flex-col gap-3">
          <span>Abdulaziz Nal - 2023 (Github @aziznal)</span>

          <Link
            className="underline"
            href="https://github.com/aziznal/daily-helper"
            target="_blank"
          >
            Project Github Link
          </Link>
        </footer>
      </body>
    </html>
  );
}
