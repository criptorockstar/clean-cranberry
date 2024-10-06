"use client";

import * as React from "react";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector, RootState } from '@/store/store';
import { Button } from "@/components/ui/button";
import useOrder from "@/hooks/useOrder";
import { MdWhatsapp } from "react-icons/md";

export default function CheckoutPage() {
  const { getOrder } = useOrder();
  const [currentOrder, setCurrentOrder] = React.useState<any>(null);

  const fetchOrder = async () => {
    const response = await getOrder();
    setCurrentOrder(response);
  };

  React.useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div className="w-full max-w-[1200px] mx-auto pt-4">
        <div className="text-2xl text-gray-600 font-semibold mx-4">
          ¡Pedido finalizado!
        </div>

        <div className="flex flex-col gap-4 h-[calc(100vh-190px)] lg:h-[calc(100vh-260px)] justify-between mx-4">
          <div>
            <div>
              ¡Ya casi! Ahora deberás hacer una transferencia a nuestro CBU, una vez hecho el pago, ve a nuestro chat en WhatsApp y envíanos el comprobante.
            </div>
            <div className="mt-2">
              0000003100033386612381
            </div>

            {/* Mapear el número de orden */}
            {currentOrder && (
              <div className="mt-2">

                {/* Mapear el estado del pedido */}
                <div className="mt-1 text-xl font-medium">
                  Estado del pedido: <span className="">{currentOrder.status}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center w-full">

            {currentOrder && (
              <div className="">
                <div className="text-xl">Tú número de orden es:</div>
                <div className="text-xl mt-3 font-semibold">{currentOrder.orderNumber}</div>
              </div>
            )}
          </div>

          <div className="flex w-full justify-end">
            <Button size="lg" className="px-6 bg-[#0a1d35]"
              onClick={() => window.location.href = 'https://wa.me/5491124023668'}
            >
              <MdWhatsapp className="text-xl mr-2" />
              Enviar comprobante
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
