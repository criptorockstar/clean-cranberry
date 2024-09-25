import dynamic from "next/dynamic";
import Render from "./Render";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const geistSans = localFont({
  src: "../public/fonts/Geist/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/Geist/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});//font-[family-name:var(--font-geist-sans)]
const Asap = localFont({
  src: [
    { path: "../public/fonts/Asap/Asap-Thin.ttf", weight: "100" },
    { path: "../public/fonts/Asap/Asap-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../public/fonts/Asap/Asap-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Asap/Asap-Medium.ttf", weight: "500" },
    { path: "../public/fonts/Asap/Asap-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../public/fonts/Asap/Asap-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/Asap/Asap-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../public/fonts/Asap/Asap-Bold.ttf", weight: "700" },
    { path: "../public/fonts/Asap/Asap-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../public/fonts/Asap/Asap-Black.ttf", weight: "900" },
    { path: "../public/fonts/Asap/Asap-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-asap",
});//font-[family-name:var(--font-asap)]
const BalooBhaijaan2 = localFont({
  src: [
    { path: "../public/fonts/Baloo/BalooBhaijaan2-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Baloo/BalooBhaijaan2-Medium.ttf", weight: "500" },
    { path: "../public/fonts/Baloo/BalooBhaijaan2-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/Baloo/BalooBhaijaan2-Bold.ttf", weight: "700" },
    { path: "../public/fonts/Baloo/BalooBhaijaan2-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-baloo",
});//font-[family-name:var(--font-baloo)]
const WorkSans = localFont({
  src: [
    { path: "../public/fonts/WorkSans/WorkSans-Thin.ttf", weight: "100" },
    { path: "../public/fonts/WorkSans/WorkSans-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-ExtraLight.ttf", weight: "200" },
    { path: "../public/fonts/WorkSans/WorkSans-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-Light.ttf", weight: "300" },
    { path: "../public/fonts/WorkSans/WorkSans-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-Regular.ttf", weight: "400" },
    { path: "../public/fonts/WorkSans/WorkSans-Medium.ttf", weight: "500" },
    { path: "../public/fonts/WorkSans/WorkSans-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/WorkSans/WorkSans-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-Bold.ttf", weight: "700" },
    { path: "../public/fonts/WorkSans/WorkSans-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-ExtraBold.ttf", weight: "800" },
    { path: "../public/fonts/WorkSans/WorkSans-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../public/fonts/WorkSans/WorkSans-Black.ttf", weight: "900" },
    { path: "../public/fonts/WorkSans/WorkSans-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-worksans",
});//font-[family-name:var(--font-worksans)]

const ReduxProvider = dynamic(() => import("@/app/StoreProvider"), {
  ssr: false
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
        min-h-screen
        ${geistSans.variable} 
        ${geistMono.variable} 
        ${Asap.variable} 
        ${BalooBhaijaan2.variable} 
        ${WorkSans.variable} antialiased`}
      >
        <ReduxProvider>
          <Render>
            {children}
            <Toaster />
          </Render>
        </ReduxProvider>
      </body>
    </html>
  );
}
