"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
import { MdDashboard, MdAccountBox } from "react-icons/md";
import DrawerMenu from "./drawer-menu";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch, RootState } from "@/store/store";
import Cookies from "js-cookie";
import { clearUser } from "@/store/slices/userSlice";
import useCart from "@/hooks/useCart";
import { setItemCount } from "@/store/slices/cartSlice";

export default function Header() {
  const user = useAppSelector((state: RootState) => state.user);
  const cartcount = useAppSelector((state: RootState) => state.cart.itemCount);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { getCount } = useCart();

  const pathname = usePathname();
  const isActive = (basePath: string) => {
    return pathname === basePath || pathname.startsWith(basePath + "/");
  };

  React.useEffect(() => {
    const getCartItems = async () => {
      const response = await getCount();
      dispatch(setItemCount(response));
    };

    getCartItems();
  }, [])

  const home = pathname === "/";
  const products = pathname === "/shops/products" || isActive("/product");
  const findUs = pathname === "/find-us";

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(clearUser());
    window.location.href = "/sign-in";
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center container mx-auto px-2">
        <DrawerMenu />
        <div className="flex items-center gap-8">
          <img src="/images/logo.svg" alt="LOGO" className="w-[50px] sm:w-[100px] " />
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex">
          <Button
            onClick={() => window.location.href = "/cart"}
            size="icon"
            className="rounded-full bg-[transparent] hover:bg-[transparent] outline-none relative"
          >
            <Badge
              variant="outline"
              className="absolute flex items-center justify-center rounded-full top-0 -mt-1.5 -mr-1 right-0 w-[16px] text-white bg-red-500 border-none"
            >
              <span className="text-xs">{cartcount}</span>
            </Badge>
            <HiOutlineShoppingBag className="text-gray-900 text-[20px]" />
          </Button>
        </div>

        <ul className="items-center gap-8 font-weight-500 hidden lg:flex">
          <li>
            <Button variant="link"
              onClick={() => window.location.href = "/"}
              className={`hover:no-underline hover:border-none hover:bg-slate-100 ${home ? "bg-slate-100" : ""}`}>
              Inicio
            </Button>
          </li>
          <li>
            <Button variant="link"
              onClick={() => window.location.href = "/shops/products"}
              className={`hover:no-underline hover:border-none hover:bg-slate-100 ${products ? "bg-slate-100" : ""}`}>
              Productos
            </Button>
          </li>
          <li>
            <Button variant="link"
              onClick={() => window.location.href = "/find-us"}
              className={`hover:no-underline hover:border-none hover:bg-slate-100 ${findUs ? "bg-slate-100" : ""}`}>
              Encuentranos
            </Button>
          </li>
        </ul>

        <div className="lg:flex items-center gap-4 hidden">
          {!user.username ? (
            <Button
              onClick={() => window.location.href = "/sign-in"}
              className="px-6"
            >
              Login
            </Button>
          ) : (
            <div
              className="lg:flex hidden mr-2.5 rounded-full hover:bg-[transparent] bg-[transparent] shadow-none"
            >
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center">
                    <HiOutlineUser className=" text-gray-900 w-[18px] focus-visible:ring-0 shadow-none outline-none  hover:bg-[transparent] bg-[transparent]" />
                    <span className="text-[16px]">cuenta</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "Admin" ? (
                    <DropdownMenuItem>
                      <div className="flex items-center">
                        <MdDashboard className="mr-2" />
                        <span onClick={() => window.location.href = "/dashboard/categories"}>Administrar</span>
                      </div>
                    </DropdownMenuItem>
                  ) : (
                    <>
                    </>
                  )}
                  <DropdownMenuItem>
                    <div className="flex items-center" onClick={logout}>
                      <HiOutlineLogout className="mr-2" />
                      <span>Cerrar sesión</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Button
            onClick={() => window.location.href = "/cart"}
            size="icon"
            className="relative rounded-full bg-[transparent] hover:bg-[transparent] outline-none shadow-none"
          >
            <Badge
              variant="outline"
              className="absolute flex items-center justify-center rounded-full top-0 -mt-1.5 -mr-1 right-0 w-[16px] text-white bg-red-500 border-none"
            >
              <span className="text-xs">{cartcount}</span>
            </Badge>
            <HiOutlineShoppingBag className="text-gray-900 text-[20px]" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden bg-[#f5f5dc] py-[10px] mb-[20px]">
        <div className="marquee whitespace-nowrap text-[16px] text-center">
          ¡Promos todos los fines de semana! 25% de descuento en productos
          seleccionados
        </div>
      </div>
      <style jsx>
        {`
          .marquee {
            display: inline-block;
            padding-left: 30%;
            animation: marquee 15s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </React.Fragment >
  );
};
