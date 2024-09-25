"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string()
    .min(1, {
      message: "El correo es obligatorio.",
    })
    .email("Debe ser un correo válido.")
    .trim(),
})

export default function PasswordRecoveryPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  }

  return (
    <React.Fragment>
      <main className="w-full h-screen flex items-start bg-[#f5f5f5]">
        <div className="relative w-1/2 h-full hidden lg:flex flex-col">
          <img src="/images/auth.png" alt="auth model image"
            className="w-full h-full object-cover"
            style={{ objectPosition: '100% 10%' }}
          />
        </div>

        <div className="w-full lg:w-1/2 h-full flex flex-col p-10 lg:p-20 justify-between items-center">
          <div className="w-full flex flex-col">
            <h3 className="text-3xl font-weight-700 select-none">Recuperar contraseña</h3>
          </div>
          <div className="w-full flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Correo electrónico"
                            className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""
                              }`}
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="select-none" />
                      </FormItem>
                    );
                  }}
                />
                <Button className="select-none bg-gradient-to-r from-blue-500 to-indigo-500 py-6 text-gray-50 text-lg">
                  Enviar
                </Button>
              </form>
            </Form>
          </div>

          <div className="w-full">
            <p className="select-none text-md font-normal text-[#060606]">Vamos a completar unos pasos para restablecer tu contraseña.</p>
          </div>
        </div>
      </main>
    </React.Fragment >
  );
}
