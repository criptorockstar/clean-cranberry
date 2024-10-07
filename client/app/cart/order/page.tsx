"use client";

import * as React from "react";
import * as z from "zod";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector, RootState } from '@/store/store';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import useOrder from "@/hooks/useOrder";
import { cleanCart } from "@/store/slices/cartSlice";

const formSchema = z.object({
  address: z.string()
    .min(1, { message: "Es necesario una dirección" })
    .trim(),
  door: z.number().nullable(),
  zip: z.string()
    .min(1, { message: "Es codigo postal es necesario" })
    .trim(),
  phone: z.string()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .nullable()
    .transform((value, ctx): string | null => {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          message: "El telefono es obligatorio"
        });
        return z.NEVER;
      }
      return value;
    })
});

export default function OrderPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      door: null,
      zip: "",
      phone: "",
    },
    mode: "onChange",
  });
  const { handleSubmit, setError, control, setValue } = form;
  const { getShipping, setShipping, setOrder } = useOrder();
  const dispatch = useAppDispatch();

  const fetchShipping = async () => {
    try {
      const response = await getShipping();
      if (response.address) {
        setValue("address", response.address);
        setValue("door", response.door);
        setValue("zip", response.zip);
        setValue("phone", response.phone);
      }
    } catch (e: any) { }
  };

  React.useEffect(() => {
    fetchShipping();
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    await setShipping(data);
    await setOrder();
    dispatch(cleanCart());
    window.location.href = "/cart/checkout"
  };

  return (
    <React.Fragment>
      <Header />
      <div className="w-full max-w-[1200px] mx-auto pt-4">
        <div className="text-2xl text-gray-600 font-semibold mx-4">
          Detalles del pedido
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-6 h-[calc(100vh-210px)] lg:h-[calc(100vh-260px)] justify-between mx-4"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-6 max-w-xl">
                <FormField
                  control={control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Dirección de entrega"
                          className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="select-none" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="door"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Numero"
                          className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                          autoComplete="off"
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Verificar si el valor es un número
                            if (value === "" || !isNaN(Number(value))) {
                              // Si es un número o está vacío, se convierte a número
                              const intValue = value ? parseInt(value, 10) : null;
                              field.onChange(intValue);

                              // Limpiar el error si es un valor numérico válido
                              setError("door", { type: "manual", message: "" });
                            } else {
                              // Si no es un número, establecer un mensaje de error
                              setError("door", {
                                type: "manual",
                                message: "Introduce un número válido",
                              });
                            }
                          }}

                        />
                      </FormControl>
                      <FormMessage className="select-none" />
                    </FormItem>
                  )}
                />

              </div>

              <div className="max-w-sm">
                <FormField
                  control={control}
                  name="zip"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Código postal"
                          className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                          autoComplete="off"
                          {...field}
                          value={field.value === null ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage className="select-none" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="max-w-sm">
                <FormField
                  control={control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Telefono"
                          className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                          autoComplete="off"
                          {...field}
                          value={field.value === null ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage className="select-none" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="lg">
                Confirmar pedido
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </React.Fragment>
  );
}
