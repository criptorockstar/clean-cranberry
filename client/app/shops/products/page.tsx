"use client";

import * as React from "react"
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import useColors from "@/hooks/useColors";
import useSizes from "@/hooks/useSizes";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/range-slider";
import { usePathname } from "next/navigation";

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

export default function ProductsPage() {
  const { getFilteredProducts, products, totalPages } = useProducts();
  const { getAllCategories } = useCategories();
  const { getAllColors } = useColors();
  const { getAllSizes } = useSizes();
  const pathname = usePathname();

  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [allColors, setAllColors] = React.useState<Color[]>([]);
  const [allSizes, setAllSizes] = React.useState<Size[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromURL = searchParams.get("page")
  const initialPageIndex = pageFromURL ? parseInt(pageFromURL) - 1 : 0;
  const [pageIndex, setPageIndex] = React.useState<number>(initialPageIndex);
  const [pageSize, _] = React.useState<number>(9);

  // FILTERS
  const catFromURL = searchParams.get("cat");
  const cate = catFromURL ? catFromURL.split(',').map(Number) : [];
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(cate);
  const [range, setRange] = React.useState<[number, number]>([0, 10000]);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);

  console.log(selectedCategories);

  React.useEffect(() => {
    loadProducts();
  }, [selectedCategories, selectedSizes, selectedColors, range, pageIndex]);

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
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [pageIndex]);

  React.useEffect(() => {
    const newUrl = `/shops/products?page=${pageIndex + 1}&cat=${selectedCategories}`;
    router.push(newUrl);
  }, [pageIndex, selectedCategories]);

  const loadProducts = async () => {
    try {
      const numericRange = range.map((value) => Number(value));
      const [minPrice, maxPrice] = numericRange;

      await getFilteredProducts(
        pageIndex + 1, // page
        pageSize, // limit
        selectedSizes.join(","), // sizes
        selectedColors.join(","), // colors
        selectedCategories.join(","), //categories
        minPrice,
        maxPrice,
      );
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const truncateText = (text: any, maxLength: any) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Pagination
  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleCategoryChange = (categoryId: any, isChecked: any) => {
    setSelectedCategories((prevSelected) => {
      const updatedSelection = isChecked
        ? [...prevSelected, categoryId]
        : prevSelected.filter((id) => id !== categoryId);

      //console.log("Selected Categories:", updatedSelection);

      // Actualizar la URL al cambiar las categorías
      const categoryParams = updatedSelection.length > 0 ? `cat=${updatedSelection.join(",")}` : "";
      const newUrl = `/shops/products?page=${pageIndex + 1}${categoryParams ? '&' + categoryParams : ''}`;
      router.push(newUrl); // Actualiza la URL aquí

      return updatedSelection;
    });
  };

  const handleColorChange = (colorId: any, isChecked: any) => {
    setSelectedColors((prevSelected) => {
      const updatedSelection = isChecked
        ? [...prevSelected, colorId]
        : prevSelected.filter((id) => id !== colorId);

      return updatedSelection;
    });
  };

  const handleSizeChange = (sizeId: any, isChecked: any) => {
    setSelectedSizes((prevSelected) => {
      const updatedSelection = isChecked
        ? [...prevSelected, sizeId]
        : prevSelected.filter((id) => id !== sizeId);

      return updatedSelection;
    });
  };

  const handleRangeChange = (newRange: [number, number]) => {
    setRange(newRange)
  }

  return (
    <React.Fragment>
      <div className="flex justify-center">
        <div className="w-full container flex">
          <div className="w-[225px] p-4 pb-0 hidden lg:block">
            <Accordion type="multiple" className="w-full" defaultValue={["item-1", "item-2", "item-3", "item-4"]}>
              <AccordionItem value="item-1">
                <AccordionTrigger><span className="text-[20px] font-weight-700">Categorías</span></AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {allCategories.map((category) => (
                      <div key={category.id} className="pb-5">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(isChecked: any) =>
                              handleCategoryChange(category.id, isChecked)
                            }
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger><span className="text-[20px] font-weight-700">Filtrar por precios</span></AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4">
                    <div className="mb-4">
                      Precio: ${range[0]} - ${range[1]}
                    </div>
                    <RangeSlider
                      value={range}
                      onValueChange={handleRangeChange}
                      min={0}
                      max={10000}
                      className="w-full max-w-md"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger><span className="text-[20px] font-weight-700">Colores</span></AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {allColors.map((color) => (
                      <div key={color.id} className="pb-5">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`color-${color.id}`}
                            onCheckedChange={(isChecked) =>
                              handleColorChange(color.id, isChecked)
                            }
                          />
                          <label
                            htmlFor={`color-${color.id}`}
                            className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {color.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger><span className="text-[20px] font-weight-700">Talles</span></AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {allSizes.map((size) => (
                      <div key={size.id} className="pb-5">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size.id}`}
                            onCheckedChange={(isChecked) =>
                              handleSizeChange(size.id, isChecked)
                            }
                          />
                          <label
                            htmlFor={`size-${size.id}`}
                            className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {size.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex-1 mx-4">
            <div className="flex flex-col min-h-screen container mx-auto">
              <div className=" block lg:hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger><span className="text-[20px] font-semibold">Filtros</span></AccordionTrigger>
                    <AccordionContent>
                      <div className=""> {/*aqui los filtros moviles*/}
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger><span className="text-[20px] font-weight-700">Categorías</span></AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col">
                                {allCategories.map((category) => (
                                  <div key={category.id} className="pb-5">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`category-${category.id}`}
                                        checked={selectedCategories.includes(category.id)}
                                        onCheckedChange={(isChecked: any) =>
                                          handleCategoryChange(category.id, isChecked)
                                        }
                                      />
                                      <label
                                        htmlFor={`category-${category.id}`}
                                        className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {category.name}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger><span className="text-[20px] font-weight-700">Filtrar por precios</span></AccordionTrigger>
                            <AccordionContent>
                              <div className="mt-4">
                                <div className="mb-4">
                                  Precio: ${range[0]} - ${range[1]}
                                </div>
                                <RangeSlider
                                  value={range}
                                  onValueChange={handleRangeChange}
                                  min={0}
                                  max={10000}
                                  className="w-full max-w-md"
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger><span className="text-[20px] font-weight-700">Colores</span></AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col">
                                {allColors.map((color) => (
                                  <div key={color.id} className="pb-5">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`color-${color.id}`}
                                        onCheckedChange={(isChecked) =>
                                          handleColorChange(color.id, isChecked)
                                        }
                                      />
                                      <label
                                        htmlFor={`color-${color.id}`}
                                        className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {color.name}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-4">
                            <AccordionTrigger><span className="text-[20px] font-weight-700">Talles</span></AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col">
                                {allSizes.map((size) => (
                                  <div key={size.id} className="pb-5">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`size-${size.id}`}
                                        onCheckedChange={(isChecked) =>
                                          handleSizeChange(size.id, isChecked)
                                        }
                                      />
                                      <label
                                        htmlFor={`size-${size.id}`}
                                        className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {size.name}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const mainImage = product.images[0]?.url;
                    return (
                      <div
                        onClick={() => window.location.href = `/shops/product/${product.slug}`}
                        key={product.id}
                        className="relative flex flex-col bg-white rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105 group"
                      >
                        <div className="relative flex-grow">
                          <img
                            src={mainImage}
                            alt={product.name || "Product Image"}
                            className="w-full h-[200px] object-cover"
                            width={500}
                            height={300}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="text-xl font-semibold mb-2 truncate">
                            {truncateText(product.name || "Title", 24)}
                          </div>
                          <div className="text-base font-light mb-2 truncate">
                            {product.description}
                          </div>
                          <div className="mt-auto text-xl font-semibold">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between container mx-auto items-center py-4 px-4">
        <span className="text-sm italic font-normal">
          Página {pageIndex + 1} de {totalPages}
        </span>

        <div className="">
          <button
            onClick={handlePreviousPage}
            disabled={pageIndex === 0}
            className={`px-4 mx-2 py-2 rounded-md ${pageIndex === 0 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Anterior
          </button>

          <button
            onClick={handleNextPage}
            disabled={pageIndex === totalPages - 1}
            className={`px-4 py-2 rounded-md ${pageIndex === totalPages - 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
