import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Canvasly",
    description:
        "Create stunning designs, presentations, social posts, and more with Canvasly, a simple and powerful online design editor.",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    );
}
