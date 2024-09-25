"use client";

import Link from "next/link"
import {
  HomeIcon,
  CircleUser,
  Menu,
  Package,
  ShoppingCart,
} from "lucide-react"
import { HiOutlineCog, HiOutlineArrowLeft, HiOutlineLogout } from "react-icons/hi";
import { MdAccountBox } from "react-icons/md";
import { useAppSelector, useAppDispatch, RootState } from "@/store/store";
import Cookies from "js-cookie";
import { clearUser } from "@/store/slices/userSlice";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation";

export default function MyAccountLayout({ children }: any) {
  const user = useAppSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(clearUser());
    router.push("/sign-in");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <img src="/images/logo.svg" className="w-16" />
              <span className="font-[family-name:var(--font-baloo)] mt-2 text-xl">Mi cuenta</span>
            </Link>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/my-account"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <HomeIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/my-account/cart"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Mi carrito
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                  6
                </Badge>
              </Link>
              <Link
                href="/my-account/buys"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Compras{" "}
              </Link>
              <Link
                href="/my-account/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <HiOutlineCog className="h-4 w-4" />
                Perfil
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <HiOutlineArrowLeft className="h-4 w-4" />
                Ir al sitio web
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>

            {/* Mobile menu */}
            <SheetContent side="left" className="flex flex-col bg-white max-w-[250px]">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="flex h-14 -mt-6 items-center lg:h-[60px]">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <img src="/images/logo.svg" className="w-16" />
                    <span className="font-[family-name:var(--font-baloo)] mt-2 text-xl">Mi cuenta</span>
                  </Link>
                </div>

                <Link
                  href="/my-account"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/my-account/cart"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Mi carrito
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="/my-account/buys"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Compras
                </Link>
                <Link
                  href="/my-account/profile"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <HiOutlineCog className="h-5 w-5" />
                  Perfil
                </Link>

                <Link
                  href="/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <HiOutlineArrowLeft className="h-5 w-5" />
                  Ir al sitio web
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex items-center">
                  <MdAccountBox className="mr-2" />
                  <Link href="/my-account">Mi cuenta</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex items-center" onClick={logout}>
                  <HiOutlineLogout className="mr-2" />
                  <span>Cerrar sesión</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

