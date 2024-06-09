import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/custom/footer";
import { Metadata } from "next";
import TostContainer from "@/components/custom/TostContainer";
;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diva The Indian Jewel",
  description: "DIVA: Where Tradition Meets Innovation in Fusion Jewelry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NextTopLoader color="#F8D247" />
          <TostContainer />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
