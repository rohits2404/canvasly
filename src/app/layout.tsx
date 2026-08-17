import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Modals } from "@/components/modals";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Canvasly",
    description:
        "Create stunning designs, presentations, social posts, and more with Canvasly, a simple and powerful online design editor.",
    icons: {
        icon: "/logo.svg",
    },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const session = await auth();

    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <Providers>
                        <Toaster />
                        <Modals />
                        <TooltipProvider>{children}</TooltipProvider>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
