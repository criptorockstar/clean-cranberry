"use client";

import * as React from "react";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SignInFormValues {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z.string()
    .min(1, {
      message: "El correo es obligatorio.",
    })
    .email("Debe ser un correo válido.")
    .trim(),
  password: z.string()
    .min(1, {
      message: "Se requiere una contraseña",
    })
});

export default function SignInPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, setError, control } = form;

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    try {
      await signIn(data.email, data.password);

      setTimeout(() => {
        if (Cookies.get("accessToken") && Cookies.get("refreshToken")) {
          router.push("/");
        }
      }, 100);

    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors as Record<string, string>;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field) {
            setError(field as keyof SignInFormValues, {
              type: "manual",
              message: message || "",
            });
          }
        }
      } else {
        console.error("Ocurrió un error inesperado:", error);
      }
    }
  };

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
            <h3 className="text-3xl font-weight-700 select-none">Iniciar sesión</h3>
          </div>
          <div className="w-full flex flex-col">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
              >
                <FormField
                  control={control}
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

                <FormField
                  control={control}
                  name="password"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Contraseña"
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
                <div className="flex justify-end">
                  <Link href="/password-recovery" className="text-[#188df9]">¿Olvidaste tu constraseña?</Link>
                </div>
                <Button className="select-none mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 py-6 text-gray-50 text-lg">
                  Login
                </Button>
              </form>
            </Form>
          </div>

          <div className="w-full">
            <p className="select-none text-md font-normal text-[#060606]">Si no tienes una cuenta, puedes crear una aquí.  <Link href="/sign-up" className="font-semibold underline underline-offset-2 text-[#188df9]">Registrate ahora</Link></p>
          </div>
        </div>
      </main>
    </React.Fragment >
  );
}
