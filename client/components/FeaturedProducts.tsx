"use client";

import React from "react";
import useProducts from "@/hooks/useProducts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function FeaturedProducts() {
  const { getFeatured } = useProducts();

  const [allProducts, setAllProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await getFeatured();
      setAllProducts(response);
    };

    getCategories();
  }, []);

  return (
    <React.Fragment>
      <div className="mx-6 lg:mx-0 mt-1 pt-1">
        <div className="w-full max-w-[1200px] mx-auto font-semibold text-xl">
          <div className="mb-1.5">Productos destacados</div>
        </div>

        <div className="flex justify-center mb-20">
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-full max-w-[1200px]"
          >
            <div>
              <CarouselPrevious />
              <CarouselNext />
            </div>
            <CarouselContent>
              {allProducts.map((product, index) => (
                <CarouselItem key={index} className="basis-1/3 lg:basis-1/4">
                  <div className="p-1 h-full w-full">
                    <div
                      className="flex flex-col h-full cursor-pointer"
                      onClick={() => window.location.href = `/shops/product/${product.slug}`}>
                      {/* Contenedor de la imagen */}
                      <div className="flex aspect-square items-center justify-center">
                        <div className="relative w-full">
                          <div className="cursor-pointer">
                            <img
                              src={product.images[0].url}
                              alt={product.name || "Product Image"}
                              className="object-cover w-full h-full rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contenedor del texto, que ocupa el espacio restante */}
                      <div className="flex-grow flex flex-col justify-between mt-2 w-full">
                        <div className="text-md font-semibold ml-2">
                          <span className="inline-block max-w-full truncate">
                            {product.name}
                          </span>
                        </div>

                        <div className="flex-grow ml-2">
                          <p className="text-sm text-gray-600">
                            {product.description}
                          </p>
                        </div>

                        <div className="text-lg font-bold mt-1 ml-2">
                          ${product.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </React.Fragment>
  );
}
