"use client";

import * as React from "react";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { uploadCategoryImage } from "@/services/admin";
import { FaUpload } from 'react-icons/fa';
import { Trash2 } from "lucide-react";
import useAdmin from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
  const { createCategory } = useAdmin();
  const { toast } = useToast();

  // IMAGEN CARGADA
  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];

    try {
      const response = await uploadCategoryImage(selectedFile);
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

  // Función para eliminar la imagen cargada
  const removeImage = () => {
    setImageUrl(null);
    form.setValue("image", ""); // Limpia el campo de la imagen en el formulario
  };

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    try {
      await createCategory(data.name, data.image);
      toast({
        variant: "success",
        description: "Categoria agregada con exito",
      });

      setTimeout(() => {
        router.push("/dashboard/categories");
      }, 100);
    } catch (error: any) {
      console.log(error);
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
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/categories">Categorias</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agregar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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

          {/* Mostrar imagen o input para cargar */}
          {imageUrl ? (
            <div className="flex gap-4 mt-4">
              <div className="relative">
                <img src={imageUrl} alt="Preview" className="object-cover w-32 h-32 border-2 border-gray-300 rounded-md" />
                <Button
                  type="button"
                  size="icon"
                  onClick={removeImage}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ) : (
            <FormField
              control={control}
              name="image"
              render={({ fieldState }) => (
                <FormItem>
                  <FormControl>
                    <label className={`flex items-center justify-center w-full h-32 border-2 ${fieldState.error ? "border-red-500" : "border-gray-300"} border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200`}>
                      <div className="text-gray-500 flex flex-col items-center justify-center w-full h-full">
                        <FaUpload className="text-2xl" />
                        <span className="text-center mt-2">Arrastra y suelta una imagen aquí o haz clic para seleccionar</span>
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

          <Button type="submit" className="self-start">
            Crear Categoría
          </Button>
        </form>
      </Form>
    </React.Fragment>
  );
}
