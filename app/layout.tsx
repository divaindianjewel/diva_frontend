import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/custom/footer";
import { Metadata } from "next";
import TostContainer from "@/components/custom/TostContainer";

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
    <html lang="en">
      <body>
        <NextTopLoader color="#F8D247" />
        <TostContainer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
