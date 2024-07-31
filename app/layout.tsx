import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/custom/footer";
import { Metadata } from "next";
import TostContainer from "@/components/custom/TostContainer";
import Head from "next/head";
import Script from "next/script";

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
      <Head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1093686505680831');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* This <noscript> tag is important for tracking users without JavaScript */}
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} 
               src="https://www.facebook.com/tr?id=1093686505680831&ev=PageView&noscript=1" 
          />
        </noscript>
      </Head>
      <body>
        <NextTopLoader color="#F8D247" />
        <TostContainer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
