import * as React from "react";
import Link from "next/link";
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineTruck } from "react-icons/hi";
import { MdOutlineWhatsapp, MdOutlinePayments } from "react-icons/md";

export default function Footer() {
  return (
    <React.Fragment>
      <div className="container mx-auto relative">
        <div
          className={`text-2xl font-semibold mx-4 -mb-6`}
        >
          Información
        </div>

        <div className="grid lg:grid-cols-3 gap-6 my-16 xs:mx-auto xs:space-y-12 lg:space-y-0">
          <div className="text-center lg:text-left mx-4">
            <HiOutlineTruck className="text-[50px] xl:mx-0 mx-auto" />
            <h4 className="font-semibold text-[24px] leading-[37px] mt-4">
              Envíos
            </h4>
            <p className="text-[22px] leading-[30px] font-normal mt-3">
              El envío lo abona el cliente Envío a todo el país
            </p>
          </div>

          <div className="text-center lg:text-left mx-4">
            <MdOutlineWhatsapp className="text-[50px] xl:mx-0 mx-auto" />
            <h4 className="font-semibold text-[24px] leading-[37px] mt-4">
              WhatsApp
            </h4>
            <p className="text-[22px] leading-[30px] font-normal mt-3">
              Hacé tu consulta por WhatsApp, recibí atención personalizada
            </p>
          </div>

          <div className="text-center lg:text-left mx-4">
            <MdOutlinePayments className="text-[50px] xl:mx-0 mx-auto" />
            <h4 className="font-semibold text-[24px] leading-[37px] mt-4">
              Abona
            </h4>
            <p className="text-[22px] leading-[30px] font-normal mt-3">
              Abona en Efectivo, Transferencia y depósito bancario
            </p>
          </div>
        </div>
      </div>

      <div className="h-1/2 w-full flex lg:flex-row flex-col justify-around items-start pt-20 bg-black relative">
        <div className="pb-5">
          <img src="/images/logo.svg" alt="footer logo" />
        </div>

        <div className="p-5">
          <ul>
            <p className="font-bold text-white text-2xl pb-4">Información</p>
            <li className="text-gray-50 font-semibold pb-2"><Link href="/cart">Carrito</Link></li>
            <li className="text-gray-50 font-semibold pb-2"><Link href="/my-account">Mi cuenta</Link></li>
          </ul>
        </div>

        <div className="p-5">
          <ul>
            <p className="font-bold text-white text-2xl pb-4">Servicios</p>
            <li className="text-gray-50 font-semibold pb-2"><Link href="/">Inicio</Link></li>
            <li className="text-gray-50 font-semibold pb-2"><Link href="/shops/products">Productos</Link></li>
            <li className="text-gray-50 font-semibold pb-2"><Link href="/#contact">Contáctanos</Link></li>
          </ul>
        </div>

        <div className="p-5">
          <ul>
            <p className="font-bold text-white text-2xl pb-4" id="contact">Contacto</p>
            <li className="text-gray-50 font-semibold pb-2">
              <Link href="">
                <p className="flex items-center">
                  <HiOutlinePhone className="mr-1 text-xl" />
                  11-4177-6489
                </p>
              </Link>
            </li>
            <li className="text-gray-50 font-semibold pb-2">
              <Link href="">
                <p className="flex items-center">
                  <HiOutlineMail className="mr-1 text-xl" />
                  cranberrymayorista@gmail.com
                </p>
              </Link>
            </li>
            <li className="text-gray-50 font-semibold pb-2">
              <Link href="">
                <p className="flex items-center">
                  <HiOutlineLocationMarker className="mr-1 text-xl" />
                  Cuenca 497 | Cuenca 683
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <footer className="bg-black text-gray-100 p-5">
        <div className="container mx-auto lg:text-center">
          <p className="mb-2">© 2024 Cranberry. Todos los derechos reservados.</p>
          <p className="text-[12px]">
            Desarrollado por{" "}
            <a
              href="https://www.appflies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600"
            >
              Appflies
            </a>
          </p>
        </div>
      </footer>
    </React.Fragment >
  );
};
