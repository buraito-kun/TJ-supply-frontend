import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TJ Supply – An Expert of Household Appliances",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <html lang="en" className="light">
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
