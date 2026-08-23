import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import SiteChrome from "@/components/SiteChrome";
import HydrateStore from "@/lib/HydrateStore";

export const metadata = {
  title: "Hesma Collection — Anti-Tarnish Fine Jewellery",
  description: "Everyday fine jewellery, designed to last. Earrings, necklaces, bracelets, rings & watches.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Work+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-ink font-body">
        <HydrateStore />
        <SiteChrome><Navbar /></SiteChrome>
        <main className="flex-1">{children}</main>
        <SiteChrome><Footer /></SiteChrome>
        <MobileTabBar />
      </body>
    </html>
  );
}
