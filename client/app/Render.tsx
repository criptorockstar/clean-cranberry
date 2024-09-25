"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Render({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Definir rutas que deben mostrar Header y Footer
  const RenderRoutes = ["/", "/find-us"];

  // Comprobar si la ruta actual coincide o empieza con '/products' o '/product/'
  const shouldRender =
    RenderRoutes.some((route) => pathname === route) ||
    pathname.startsWith("/shops/products") ||
    pathname.startsWith("/shops/product/");

  return (
    <>
      {shouldRender && <Header />}
      {children}
      {shouldRender && <Footer />}
    </>
  );
}
