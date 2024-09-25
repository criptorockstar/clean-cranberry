"use client";

import Link from "next/link";
import {
  HomeIcon,
  CircleUser,
  Menu,
  Package,
  ShoppingCart,
} from "lucide-react";
import { HiOutlineLogout, HiTag } from "react-icons/hi";
import { FaStore, FaWhatsapp } from "react-icons/fa";
import { useAppSelector, useAppDispatch, RootState } from "@/store/store";
import Cookies from "js-cookie";
import { clearUser } from "@/store/slices/userSlice";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import * as Dialog from '@radix-ui/react-dialog';

export default function DashboardLayout({ children }: any) {
  const user = useAppSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(clearUser());
    router.push("/sign-in");
  };

  const renderNavLinks = () => {
    const navItems = [
      { href: "/dashboard", label: "Dashboard", icon: <HomeIcon className="h-4 w-4" aria-hidden="true" /> },
      { href: "/dashboard/categories", label: "Categorías", icon: <HiTag className="h-4 w-4" aria-hidden="true" />, active: true },
      { href: "/dashboard/products", label: "Productos", icon: <Package className="h-4 w-4" aria-hidden="true" /> },
      { href: "/dashboard/orders", label: "Pedidos", icon: <ShoppingCart className="h-4 w-4" aria-hidden="true" /> },
      { href: "/dashboard/whatsapp", label: "WhatsApp", icon: <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> },
      { href: "/", label: "Ir a la tienda", icon: <FaStore className="h-4 w-4" aria-hidden="true" /> },
    ];

    return navItems.map(({ href, label, icon, active }) => (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${active ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'
          }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    ));
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="Volver a la tienda">
              <img src="/images/logo.svg" className="w-16" alt="Logo" />
              <span className="mt-2 text-xl">Admin</span>
            </Link>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4" aria-label="Navegación principal">
              {renderNavLinks()}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <Dialog.Title className="DialogTitle"></Dialog.Title>
            <SheetTrigger>
              <div className="shrink-0 md:hidden" aria-label="Abrir menú de navegación">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white max-w-[250px]" aria-label="Menú de navegación móvil">
              <div className="flex h-14 items-center border-b -mt-6 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="Volver a la tienda">
                  <img src="/images/logo.svg" className="w-16" alt="Logo" />
                  <span className="mt-2 text-xl">Admin</span>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium" aria-hidden="false">
                {renderNavLinks()}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1"></div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full" aria-label="Abrir menú de usuario">
                <CircleUser className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <HiOutlineLogout className="mr-2" aria-hidden="true" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6" aria-label="Contenido principal">
          {children}
        </main>
      </div>
    </div>
  );
}
