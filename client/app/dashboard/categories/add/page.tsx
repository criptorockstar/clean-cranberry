"use client";

import * as React from "react";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/services/admin";
import { FaUpload } from 'react-icons/fa';
import useAdmin from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast"

interface CategoryFormValues {
  name: string;
  image: string;
}

const formSchema = z.object({
  name: z.string()
    .min(1, {
      message: "El nombre es obligatorio",
    }).trim(),
  image: z.string()
    .min(1, {
      message: "Se requiere una imagen",
    }).trim()
});

export default function AddCategory() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { handleSubmit, setError, control } = form;

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const { createCategory, loading } = useAdmin();

  // IMAGE UPLOAD
  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];

    try {
      const response = await uploadImage(selectedFile);
      const url = response.url;
      form.setValue("image", url);
      setImageUrl(url);
    } catch (error: any) {
      setError("image", {
        type: "manual",
        message: error.response?.data?.error || "Error al subir la imagen",
      });
    }
  };
  const { toast } = useToast();
  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    try {
      const response = await createCategory(data.name, data.image);
      console.log(response)
      toast({
        variant: "success",
        description: "Categoria agregada con exito",
      });

      setTimeout(() => {
        router.push("/dashboard/categories");
      }, 100)
    } catch (error: any) {
      console.log(error)
      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors as Record<string, string>;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field) {
            setError(field as keyof CategoryFormValues, {
              type: "manual",
              message: message || "",
            });
          }
        }
      }
    }
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full container flex flex-col gap-4"
        >
          <FormField
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nombre"
                    className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="select-none" />
              </FormItem>
            )}
          />

          {/* Input para la imagen */}
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="object-cover w-full h-32 border-2 border-gray-300 rounded-md" />
          ) : (
            <FormField
              control={control}
              name="image"
              render={({ fieldState }) => (
                <FormItem>
                  <FormControl>
                    <label className={`flex items-center justify-center w-full h-32 border-2 ${fieldState.error ? "border-red-500" : "border-gray-300"} border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200`}>
                      <div className="text-gray-500 flex flex-col items-center justify-center w-full h-full">
                        <span className="text-center">Arrastra y suelta una imagen aquí o haz clic para seleccionar</span>
                        <FaUpload className="mt-2 text-xl" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                      />
                    </label>
                  </FormControl>
                  <FormMessage className="select-none" />
                </FormItem>
              )}
            />
          )}

          {/* Botón de enviar */}
          <Button type="submit" className="self-start">
            Crear Categoría
          </Button>
        </form>
      </Form>
    </React.Fragment>
  );
}
