import * as React from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@/components/drawer";
import { HiMenu } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
import { MdDashboard, MdAccountBox } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppSelector, useAppDispatch, RootState } from "@/store/store";
import Cookies from "js-cookie";
import { clearUser } from "@/store/slices/userSlice";

export default function DrawerMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (basePath: string) => {
    return pathname === basePath || pathname.startsWith(basePath + "/");
  };

  const home = pathname === "/";
  const products = pathname === "/shops/products" || isActive("/product");
  const findUs = pathname === "/find-us";

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(clearUser());
    router.push("/sign-in");
    setIsOpen(false); // Cierra el Drawer al cerrar sesión
  };

  // Navegación y cierre del Drawer
  const handleNavigation = (path: string) => {
    window.location.href = path;
    setIsOpen(false); // Cierra el Drawer tras hacer clic
  };

  return (
    <React.Fragment>
      <div className="lg:hidden">
        <Drawer direction="left" open={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerTrigger asChild>
            <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <HiMenu className="text-[20px] text-[#188df9]" />
            </div>
          </DrawerTrigger>
          <DrawerContent className="bg-white border-none outline-none">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>

            <div className="p-4 pb-2 flex justify-center items-center">
              <img src="/images/logo.svg" alt="logo" width={100} height={100} />
            </div>

            <ul className="flex-1 px-3">
              <li
                onClick={() => handleNavigation("/")}
                className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${home ? "bg-slate-100" : ""}`}
              >
                <div className="flex items-center w-full">
                  <span className="ml-2">Inicio</span>
                </div>
              </li>

              <li
                onClick={() => handleNavigation("/shops/products")}
                className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${products ? "bg-slate-100" : ""}`}
              >
                <div className="flex items-center w-full">
                  <span className="ml-2">Productos</span>
                </div>
              </li>

              <li
                onClick={() => handleNavigation("/find-us")}
                className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${findUs ? "bg-slate-100" : ""}`}
              >
                <div className="flex items-center w-full">
                  <span className="ml-2">Encuentranos</span>
                </div>
              </li>

              {!user.username ? (
                <li
                  className={`relative flex items-center py-2 my-1 mt-0 font-medium rounded-md cursor-pointer transition-colors bg-gradient-to-r from-blue-500 to-indigo-500`}
                >
                  <div className="flex items-center w-full justify-center" onClick={() => handleNavigation("/sign-in")}>
                    <span className="text-center text-white">Login</span>
                  </div>
                </li>
              ) : (
                <li className={`relative flex items-center px-3 font-medium bg-slate-0 rounded-md cursor-pointer transition-colors w-full`}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="w-full">
                        <div className="flex items-center w-full">
                          <HiOutlineUser className="text-gray-900 w-[18px]" />
                          <span className="text-[16px] ml-2">Cuenta</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="w-full">
                        <ul>
                          {user.role === "Admin" && (
                            <li
                              onClick={() => handleNavigation("/dashboard/categories")}
                              className={`relative flex items-center py-2 px-3 font-medium hover:bg-slate-100 rounded-md cursor-pointer transition-colors w-full`}>
                              <div className="flex items-center">
                                <MdDashboard className="mr-2" />
                                <span>Administrar</span>
                              </div>
                            </li>)}
                          <li
                            onClick={logout}
                            className={`relative flex items-center py-2 px-3 font-medium hover:bg-slate-100 rounded-md cursor-pointer transition-colors w-full`}>
                            <div className="flex items-center">
                              <HiOutlineLogout className="mr-2" />
                              <span>Cerrar sesión</span>
                            </div>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </li>
              )}
            </ul>
          </DrawerContent>
        </Drawer>
      </div>
    </React.Fragment>
  );
}
