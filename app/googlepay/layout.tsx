import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Google Pay",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Script
                src="https://pay.google.com/gp/p/js/pay.js"
                strategy="afterInteractive"
            />
            <Script
                src="https://js.braintreegateway.com/web/3.103.0/js/client.min.js"
                strategy="afterInteractive"
            />
            <Script
                src="https://js.braintreegateway.com/web/3.103.0/js/google-payment.min.js"
                strategy="afterInteractive"
            />

            <body className={inter.className}>{children}</body>
        </html>
    );
}
