"use client";

import * as React from "react";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector, RootState } from '@/store/store';
import useCart from "@/hooks/useCart";
import {
  updateQuantity as updateItemQuantity,
  removeItemFromCart,
  setCart,
  increaseItemCount,
  decreaseItemCount,
} from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/input";
import useColors from "@/hooks/useColors";
import useSizes from "@/hooks/useSizes";

interface Color {
  id: number;
  name: string;
  code: string;
}

interface Size {
  id: number;
  name: string;
}

export default function CartPage() {
  const { getCart, increaseQuantity, decreaseQuantity, updateQuantity, removeItem, } = useCart();
  const { getAllColors } = useColors();
  const { getAllSizes } = useSizes();
  const [allColors, setAllColors] = React.useState<Color[]>([]);
  const [allSizes, setAllSizes] = React.useState<Size[]>([]);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = React.useState<{ [key: number]: string | null }>({});

  const getCartItems = async () => {
    try {
      const response = await getCart();
      dispatch(setCart(response));
    } catch (e: any) { }
  }

  React.useEffect(() => {
    const getColors = async () => {
      const response = await getAllColors();
      setAllColors(response);
    };

    const getSizes = async () => {
      const response = await getAllSizes();
      setAllSizes(response);
    };

    getCartItems();
    getColors();
    getSizes();
  }, []);

  const handleDecrease = async (id: number) => {
    await decreaseQuantity(id);
    dispatch(decreaseItemCount(id));
  }

  const handleIncrease = async (id: number) => {
    await increaseQuantity(id);
    dispatch(increaseItemCount(id));
  }

  const onUpdate = async (id: number, newValue: number) => {
    if (newValue === 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [id]: "* obligatorio"
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [id]: null
      }));
      await updateQuantity(id, newValue);
      dispatch(updateItemQuantity({ id, quantity: newValue }));
    }
  };

  const handleRemove = async (id: number) => {
    setErrors(prevErrors => {
      const { [id]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });

    await removeItem(id);
    dispatch(removeItemFromCart(id));
  };


  const carts = useAppSelector((state: RootState) => state.cart.cart);
  if (!carts || carts.items.length === 0) {
    return (
      <React.Fragment>
        <Header />
        <div className="flex flex-col h-[calc(100vh-170px)] justify-center items-center">
          <div className="w-full max-w-[1000px] mx-auto py-6 overflow-auto">
            <div className="flex items-center justify-center text-gray-500">
              No hay elementos en el carrito
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  const isButtonDisabled = Object.values(errors).some(error => error !== null) || carts.items.length === 0;
  const delivery = carts.items.length !== 0 ? 2500 : 0;

  return (
    <React.Fragment>
      <Header />

      <div className="flex flex-col h-[calc(100vh-115px)] lg:h-[calc(100vh-170px)] justify-between">
        <div className="w-full max-w-[1000px] mx-auto py-6 overflow-auto">
          {carts.items.map((item, index) => {
            const color = allColors.find(c => c.id === item.color);
            const size = allSizes.find(s => s.id === item.size);

            return (
              <div key={index}>
                <div className="flex flex-col lg:flex-row justify-between items-center my-2">
                  <div className="flex flex-row items-center">
                    <Button size="icon" onClick={() => handleRemove(item.id)}>
                      <Trash2 />
                    </Button>

                    <div className="ml-6 no-select">
                      <img
                        alt="Imagen categoria"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={item.product.images[0].url}
                        width="64"
                      />
                    </div>

                    <div className="ml-6 no-select">
                      <div className="flex flex-col">
                        <div className="font-semibold">
                          {item.product.name}
                        </div>

                        <div>
                          {item.product.description}
                        </div>

                        <div className="font-semibold">
                          ${item.product.price}
                        </div>
                      </div>
                    </div>

                    <div className="ml-2 flex flex-col lg:flex-row gap-2 no-select">
                      <div className="font-bold">
                        {size ? size.name : "Tamaño no disponible"}
                      </div>
                      <div className="font-bold">
                        {color ? color.name : "Color no disponible"}
                      </div>
                    </div>
                  </div>

                  <div className="max-w-[120px] relative mb-8">
                    <Input
                      numeric={true}
                      min={1}
                      value={item.quantity}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        const value = input.value;

                        if (!/^\d+$/.test(value)) {
                          input.value = value.replace(/\D/g, '');
                        }
                      }}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);

                        if (!newValue || newValue <= 0) {
                          setErrors(prevErrors => ({
                            ...prevErrors,
                            [item.id]: "* obligatorio"
                          }));
                        } else {
                          setErrors(prevErrors => ({
                            ...prevErrors,
                            [item.id]: null
                          }));
                          onUpdate(item.id, newValue);
                        }
                      }}
                      onIncrease={() => {
                        handleIncrease(item.id);
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          [item.id]: null
                        }));
                      }}
                      onDecrease={() => {
                        handleDecrease(item.id);
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          [item.id]: null
                        }));
                      }}
                    />
                    {errors[item.id] && <p className="text-red-500 absolute text-sm mt-1">{errors[item.id]}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-y-gray-500 border-b-transparent py-4 lg:py-4">
          <div className="flex flex-row justify-between max-w-[1000px] mx-4 lg:mx-auto">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div>
                  Envio:
                </div>

                <div className="text-xl mt-2">
                  Total a pagar:
                </div>
              </div>

              <div>
                <div>
                  ${delivery}
                </div>

                <div className="text-xl mt-2">
                  ${carts.total}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Button size="lg" className="bg-[#0a1d35] py-6 lg:px-12 text-xl"
                onClick={() => window.location.href = "/cart/order"}
                disabled={isButtonDisabled}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
