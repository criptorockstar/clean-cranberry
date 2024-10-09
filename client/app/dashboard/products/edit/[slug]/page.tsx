"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel, } from "@/components/ui/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/services/admin";
import { FaUpload } from 'react-icons/fa';
import { Trash2 } from "lucide-react";
import useAdmin from "@/hooks/useAdmin";
import useProducts from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Select from 'react-select';
import { Checkbox } from "@/components/ui/checkbox";
import useCategories from "@/hooks/useCategories";
import useColors from "@/hooks/useColors";
import useSizes from "@/hooks/useSizes";
import { HiStar, HiOutlineStar } from "react-icons/hi";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface Color {
  id: number;
  name: string;
  code: string;
}

interface Size {
  id: number;
  name: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  quantity: string;
  stock?: number;
  images: string[];
  price?: number;
  offer?: number;
  colors: string[];
  sizes: string[];
  categories: string[];
}

const formSchema = z.object({
  name: z.string()
    .min(1, { message: "El nombre es obligatorio" })
    .trim(),
  description: z.string()
    .min(1, { message: "La descripción es obligatoria" })
    .trim(),
  quantity: z.enum(["limitado", "ilimitado"], {
    errorMap: () => ({ message: "Debe seleccionar una cantidad" }),
  }),
  stock: z.number()
    .positive({ message: "El stock debe ser mayor a 0" })
    .nullable()
    .transform((value, ctx): number => {
      if (value == null) {
        ctx.addIssue({
          code: "invalid_type",
          expected: "number",
          received: "null",
        });
        return z.NEVER;
      }
      return value;
    }),
  price: z.number()
    .positive({ message: "El precio debe ser mayor a 0" })
    .nullable()
    .transform((value, ctx): number => {
      if (value == null) {
        ctx.addIssue({
          code: "invalid_type",
          expected: "number",
          received: "null",
        });
        return z.NEVER;
      }
      return value;
    }),
  featured: z.boolean().optional(),
  offer: z.number().optional(),
  colors: z.array(z.string()).refine((value) => value.some((color) => color), {
    message: "Debes seleccionar almenos 1 color",
  }),
  sizes: z.array(z.string()).refine((value) => value.some((size) => size), {
    message: "Debes seleccionar almenos 1 talle",
  }),
  images: z.array(z.string())
    .min(1, { message: "Se requiere al menos una imagen" })
    .max(2, { message: "Solo se permiten hasta 2 imágenes" }),
  categories: z.array(z.string())
    .min(1, { message: "Se requiere al menos una categoria" })
}).superRefine((data, ctx) => {
  if (data.quantity === "limitado") {
    if (!data.stock || data.stock <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El stock es obligatorio",
        path: ["stock"],
      });
    }
  }
});

export default function EditProduct({ params }: any) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
      quantity: "ilimitado",
      stock: 1,
      price: 0,
      offer: 0,
      featured: false,
      colors: [],
      sizes: [],
      categories: [],
    },
    mode: "onChange",
  });

  const { setValue } = form;

  const { getProduct } = useProducts();
  const { getAllCategories } = useCategories();
  const { getAllColors } = useColors();
  const { getAllSizes } = useSizes();
  const [productId, setProductId] = React.useState<number | null>(null);
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [allColors, setAllColors] = React.useState<Color[]>([]);
  const [allSizes, setAllSizes] = React.useState<Size[]>([]);

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await getAllCategories();
      setAllCategories(response);
    };

    const getColors = async () => {
      const response = await getAllColors();
      setAllColors(response);
    };

    const getSizes = async () => {
      const response = await getAllSizes();
      setAllSizes(response);
    };

    getCategories();
    getColors();
    getSizes();
    loadProduct();
  }, []);


  const loadProduct = async () => {
    try {
      const response = await getProduct(params.slug);
      console.log(response)

      if (response && response.id) {
        setProductId(response.id);
        setValue("name", response.name);
        setValue("description", response.description);
        setValue("quantity", response.quantity || "ilimitado");
        const quantityValue = response.quantity || "ilimitado";
        setIsLimited(quantityValue === "limitado");

        setValue("featured", response.featured);
        setIsFeatured(response.featured);
        setValue("stock", response.stock || 1);
        setValue("price", response.price || 0);
        setValue("offer", response.offer || 0);

        const imageUrls = response.images.map((image: any) => image.url);
        setImageUrls(imageUrls);
        form.setValue("images", imageUrls);


        if (response.categories && response.categories.length > 0) {
          const selectedCategories = response.categories.map((category: any) => category.slug);
          setValue("categories", selectedCategories);
        }

        if (response.colors && response.colors.length > 0) {
          const selectedColors = response.colors.map((color: any) => color.id.toString());
          setValue("colors", selectedColors);
        }

        if (response.sizes && response.sizes.length > 0) {
          const selectedSizes = response.sizes.map((size: any) => size.id.toString());
          setValue("sizes", selectedSizes);
        }

      } else {
        console.error("Product ID not found");
      }
    } catch (error) {
      console.error("Error loading product", error);
    }
  };

  const router = useRouter();
  const { handleSubmit, setError, control } = form;
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const { updateProduct, loading } = useAdmin();
  const { toast } = useToast();
  const [isLimited, setIsLimited] = React.useState<boolean>(false);
  const [isFeatured, setIsFeatured] = React.useState<boolean>(false);

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (files.length + imageUrls.length > 2) {
      setError("images", {
        type: "manual",
        message: "Solo puedes subir hasta 2 imágenes",
      });
      return;
    }

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const response = await uploadImage(file);
          return response.url;
        })
      );

      const updatedImages = [...imageUrls, ...urls].slice(0, 2);
      setImageUrls(updatedImages);
      form.setValue("images", updatedImages);

      // Limpia el error al subir imágenes correctamente
      form.clearErrors("images");
    } catch (error: any) {
      setError("images", {
        type: "manual",
        message: error.response?.data?.error || "Error al subir las imágenes",
      });
    }
  };

  const removeImage = (url: string) => {
    const updatedImages = imageUrls.filter((img) => img !== url);
    setImageUrls(updatedImages);
    form.setValue("images", updatedImages);
  };

  const handleQuantityChange = (value: "limitado" | "ilimitado") => {
    setIsLimited(value === "limitado");
    form.setValue("quantity", value);

    if (value === "limitado") {
      form.setValue("stock", 0);
    } else {
      form.setValue("stock", 1);
    }

    form.trigger(["quantity", "stock"]);
  };

  const onColorChecked = (colorId: string) => {
    // Verificar si el color ya está seleccionado
    if (form.getValues("colors").includes(colorId)) {
      // Si está seleccionado, lo elimina
      const updatedColors = form.getValues("colors").filter((id) => id !== colorId);
      form.setValue("colors", updatedColors);
    } else {
      // Si no está seleccionado, lo añade
      const updatedColors = [...form.getValues("colors"), colorId];
      form.setValue("colors", updatedColors);
    }

    if (form.getValues("colors").length === 0) {
      setError("colors", { type: "manual", message: "Debe seleccionar almenos 1 color" });
    } else {
      form.clearErrors("colors");
    }
  };

  const onSizeChecked = (sizeId: string) => {
    // Verificar si el color ya está seleccionado
    if (form.getValues("sizes").includes(sizeId)) {
      // Si está seleccionado, lo elimina
      const updatedSizes = form.getValues("sizes").filter((id) => id !== sizeId);
      form.setValue("sizes", updatedSizes);
    } else {
      // Si no está seleccionado, lo añade
      const updatedSizes = [...form.getValues("sizes"), sizeId];
      form.setValue("sizes", updatedSizes);
    }

    if (form.getValues("sizes").length === 0) {
      setError("sizes", { type: "manual", message: "Debe seleccionar almenos 1 talle" });
    } else {
      form.clearErrors("sizes");
    }
  };

  const onFeatured = () => {
    setIsFeatured(!isFeatured);
    form.setValue("featured", !isFeatured);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (productId === null) {
      setError("name", {
        type: "manual",
        message: "Error: No se pudo procesar la categoria.",
      });
      return;
    }

    try {
      await updateProduct(productId as number, data);
      toast({
        variant: "success",
        description: "Producto agregado con éxito",
      });
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 100);
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors as Record<string, string>;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field) {
            setError(field as keyof ProductFormValues, {
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
      <div className="flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products">Productos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agregar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button size="icon" className="bg-gray-900" onClick={onFeatured}>
          {isFeatured ? (
            <HiStar className="text-2xl text-yellow-500" />
          ) : (
            <HiOutlineStar className="text-2xl" />
          )}
        </Button>
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

          <FormField
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Descripción"
                    className={`bg-slate-50 dark:bg-slate-500 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="select-none" />
              </FormItem>
            )}
          />

          <div className={`${imageUrls.length > 0 ? 'flex flex-col-reverse lg:flex-row mb-4' : ''}`}>
            {/* Mostrar el input de carga de imágenes solo si hay menos de 2 imágenes */}
            {imageUrls.length < 2 && (
              <FormField
                control={control}
                name="images"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <label className={`flex mt-4 px-4 items-center justify-center w-full h-32 border-2 ${fieldState.error ? "border-red-500" : "border-gray-300"} border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200`}>
                        <div className="text-gray-500 flex flex-col items-center justify-center w-full h-full">
                          <FaUpload className="text-2xl" />
                          <span className="text-center mt-2">Arrastra y suelta hasta 2 imágenes aquí o haz clic para seleccionar</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onImageUpload}
                          className="hidden"
                          multiple
                        />
                      </label>
                    </FormControl>
                    <FormMessage className="select-none" />
                  </FormItem>
                )}
              />
            )}

            {/* Mostrar las imágenes cargadas */}
            <div className="flex gap-4 mt-4 lg:ml-2">
              {imageUrls.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="Preview" className="object-cover w-32 h-32 border-2 border-gray-300 rounded-md" />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => removeImage(url)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col mt-3">
            <FormField
              control={control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleQuantityChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="ilimitado" id="ilimitado" />
                        </FormControl>
                        <FormLabel htmlFor="ilimitado" className="font-normal">
                          Ilimitado
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="limitado" id="limitado" />
                        </FormControl>
                        <FormLabel htmlFor="limitado" className="font-normal">
                          Limitado
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Condicionalmente renderiza el campo de stock */}
            {isLimited && (
              <FormField
                control={control}
                name="stock"
                render={({ field, fieldState }) => (
                  <FormItem className="mt-6">
                    <FormLabel className="">Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Stock"
                        className={`bg-slate-50 dark:bg-slate-500 mt-4 max-w-sm py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                        autoComplete="off"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Verificar si el valor es un número
                          if (value === "" || !isNaN(Number(value))) {
                            // Si es un número o está vacío, se convierte a número
                            const intValue = value ? parseInt(value, 10) : 0;
                            field.onChange(intValue);

                            // Limpiar el error si es un valor numérico válido
                            setError("stock", { type: "manual", message: "" });
                          } else {
                            // Si no es un número, establecer un mensaje de error
                            setError("stock", {
                              type: "manual",
                              message: "Por favor, introduce un número válido",
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="select-none" />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <FormField
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <FormItem className="mt-6">
                  <FormLabel className="">Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio"
                      className={`bg-slate-50 dark:bg-slate-500 mt-4 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                      autoComplete="off"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Verificar si el valor es un número
                        if (value === "" || !isNaN(Number(value))) {
                          // Si es un número o está vacío, se convierte a número
                          const intValue = value ? parseInt(value, 10) : undefined;
                          field.onChange(intValue);

                          // Limpiar el error si es un valor numérico válido
                          setError("price", { type: "manual", message: "" });
                        } else {
                          // Si no es un número, establecer un mensaje de error
                          setError("price", {
                            type: "manual",
                            message: "Por favor, introduce un número válido",
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="select-none" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="offer"
              render={({ field, fieldState }) => (
                <FormItem className="lg:mt-6">
                  <FormLabel className="">Oferta</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Oferta"
                      className={`bg-slate-50 dark:bg-slate-500 mt-4 py-5 focus-visible:ring-0 outline-none ${fieldState.error ? "border-red-500" : ""}`}
                      autoComplete="off"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Verificar si el valor es un número
                        if (value === "" || !isNaN(Number(value))) {
                          // Si es un número o está vacío, se convierte a número
                          const intValue = value ? parseInt(value, 10) : 0;
                          field.onChange(intValue);

                          // Limpiar el error si es un valor numérico válido
                          setError("offer", { type: "manual", message: "" });
                        } else {
                          // Si no es un número, establecer un mensaje de error
                          setError("offer", {
                            type: "manual",
                            message: "Por favor, introduce un número válido",
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

          <div className="mt-4 lg:mt-6">
            <FormField
              control={control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorías</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      options={allCategories.map(category => ({
                        value: category.slug,
                        label: category.name,
                      }))}
                      placeholder="Seleccione categorías"
                      onChange={(selected) => {
                        const selectedCategories = selected.map((option) => option.value);
                        field.onChange(selectedCategories);
                      }}
                      value={allCategories
                        .filter(category => field.value.includes(category.slug))
                        .map(category => ({
                          value: category.slug,
                          label: category.name,
                        }))}
                    />
                  </FormControl>
                  <FormMessage className="select-none" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mt-6">
            <FormField
              control={form.control}
              name="colors"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">Colores</FormLabel>
                  </div>

                  <div className="flex flex-row flex-wrap">
                    {allColors.map((color) => (
                      <FormField
                        key={color.id}
                        control={form.control}
                        name="colors"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={color.id}
                              className="flex flex-col-reverse items-center mx-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(color.id.toString())}
                                  onCheckedChange={() => onColorChecked(color.id.toString())}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                <div
                                  className="w-[40px] h-[40px] rounded-none border"
                                  style={{ backgroundColor: color.code }}
                                ></div>
                                <div className="p-1"></div>
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mt-6">
            <FormField
              control={form.control}
              name="sizes"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">Talles</FormLabel>
                  </div>

                  <div className="flex flex-row flex-wrap">
                    {allSizes.map((size) => (
                      <FormField
                        key={size.id}
                        control={form.control}
                        name="sizes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={size.id}
                              className="flex flex-col-reverse items-center mx-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(size.id.toString())}
                                  onCheckedChange={() => onSizeChecked(size.id.toString())}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                <div
                                  className="flex items-center justify-center w-[40px] h-[40px] rounded-none border bg-black text-white"
                                >
                                  {size.name}
                                </div>
                                <div className="p-1"></div>
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="self-start mt-2">
            Crear Producto
          </Button>
        </form>
      </Form>
    </React.Fragment >
  );
}
