"use client";

import React from "react";
import useCategories from "@/hooks/useCategories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export default function FeaturedCategories() {
  const { getAllCategories } = useCategories();

  const [allCategories, setAllCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await getAllCategories();
      setAllCategories(response);
    };

    getCategories();
  }, []);

  return (
    <React.Fragment>
      <div className="mx-6 lg:mx-0">
        <div className="w-full max-w-[1200px] mx-auto font-semibold text-xl">
          <div className="mb-1.5">Categorias</div>
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
              {allCategories.map((category, index) => (
                <CarouselItem key={index} className="basis-1/3 lg:basis-1/4">
                  <div className="p-1 h-full w-full">
                    <div
                      className="flex flex-col h-full cursor-pointer"
                      onClick={() => window.location.href = `/shops/products?cat=${category.id}`}>
                      {/* Contenedor de la imagen */}
                      <div className="flex aspect-square items-center justify-center">
                        <div className="relative w-full">
                          <div className="cursor-pointer">
                            <img
                              src={category.image}
                              alt={category.name || "Product Image"}
                              className="object-cover w-full h-full rounded-xl"
                            />
                          </div>
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
