import { Montserrat } from "next/font/google";
import "./globals.css";
import Provider from "@/utils/Provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ConfigProvider } from "@/utils/ConfigProvider";
import {SpeedInsights} from "@vercel/speed-insights/next";

const montserrat = Montserrat({ subsets: ["latin"] });
const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://${process.env.LOCAL_URL}`;

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Resort Reservation",
    description: "RRS",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("scroll-smooth", montserrat.className)}>
            <body>
                <Provider>
                    <ConfigProvider>    
                        <main className="flex flex-1 flex-col overflow-hidden">
                            {children}
                        </main>
                        <Toaster />
                    </ConfigProvider>
                </Provider>
                <SpeedInsights />
            </body>
        </html>
    );
}
