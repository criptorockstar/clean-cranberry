"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/store/store';
import useProducts from "@/hooks/useProducts";
import { addProduct, cleanProduct } from "@/store/slices/productSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/input";
import useCart from "@/hooks/useCart";
import { setItemCount } from "@/store/slices/cartSlice";

export default function ProductPage({ params }: any) {
  const { getProduct, getRelated, relatedProducts } = useProducts();
  const { addCart } = useCart();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(cleanProduct());
  }, [pathname, dispatch]);

  const [productDetails, setProductDetails] = React.useState({
    id: null,
    size: null,
    color: null,
    quantity: 1,
  });

  const [imageUrl, setImageUrl] = React.useState();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(params.slug);
        dispatch(addProduct(response));
        setImageUrl(response.images[0].url);

        setProductDetails((prevDetails) => ({
          ...prevDetails,
          id: response.id,
          size: response.sizes[0].id,
          color: response.colors[0].id,
          quantity: 1,
        }));

        const categoryIds = response.categories.map((category: any) => category.id).join(',');
        await getRelated(categoryIds);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, []);


  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.slug === params.slug)
  );

  const handleImage = (data: any) => {
    setImageUrl(data);
  };

  const handleColor = (color: any) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      color: color,
    }));
  }

  const handleSize = (size: any) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      size: size,
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      quantity: newQuantity,
    }));
  };


  // ADD ITEM CART
  const { getCount, getCart } = useCart();
  const handleCart = async () => {
    if (productDetails.id && productDetails.size && productDetails.color && productDetails.quantity > 0) {
      await addCart(
        productDetails.id,
        productDetails.quantity,
        productDetails.size,
        productDetails.color,
      );


      const responseCart = await getCart();
      console.log(responseCart)

      const response = await getCount();
      dispatch(setItemCount(response));
    }
  };

  if (!product) return <>Producto no encontrado</>

  return (
    <React.Fragment>
      <div className="py-8 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative w-full">
          <div className="lg:absolute lg:inset-0 mx-6 lg:mx-0">
            <img
              src={imageUrl}
              alt={product.name || "Product Image"}
              className="lg:object-cover lg:absolute lg:right-0 lg:max-w-[448px] w-full h-full rounded-xl"
            />
          </div>
        </div>

        {/**/}
        <div className="justify-center container flex lg:hidden">
          <div className="w-full mx-6">
            <Carousel
              opts={{
                align: "end",
              }}
              className="w-full max-w-[448px]"
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/3">
                    <div className="p-1 h-full w-full">
                      <div>
                        <div className="flex aspect-square items-center justify-center">
                          <div className="relative w-full">
                            <div className="cursor-pointer" onClick={() => handleImage(image.url)}>
                              <img
                                src={image.url}
                                alt={product.name || "Product Image"}
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
        {/**/}

        {/* Second Column: Product Details */}
        <div className="flex flex-col space-y-4 pl-8 bg-white  lg:min-w-[400px] max-w-[650px]">
          <div>
            <h1 className="text-[30px] font-bold">{product.name}</h1>
            <p className="text-[20px] font-light">{product.description}</p>

            <div className="flex flex-row mt-3">
              {product.offer > 0 ? (
                <>
                  <div className="text-[24px] font-weight-500">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-[24px] ml-4 text-[#7D7D7D] line-through">
                    ${product.offer.toFixed(2)}
                  </div>
                </>
              ) : (
                <div className="text-[24px] font-weight-500">
                  ${product.price.toFixed(2)}
                </div>
              )}
            </div>

            <div>
              <div className="text-[20px] font-semibold mt-5">Talle</div>

              <div className="mt-2 bg-white rounded-xl mr-4 lg:mr-0 lg:ml-[-3px]">
                <div className="flex flex-row flex-wrap">
                  <div className="flex flex-row flex-wrap">
                    {product.sizes.map((size) => (
                      <div key={size.id} className="flex flex-col items-center mb-4 mx-2">
                        <div
                          className={`
                          w-[40px] h-[40px] cursor-pointer rounded-md bg-white text-black border
                          ${productDetails.size === size.id ? "border-black border-2" : "border"
                            }`}
                          onClick={() => handleSize(size.id)}
                        >
                          <div className="flex items-center justify-center h-full">
                            {size.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[20px] font-semibold mt-2">Color</div>

              <div className="mt-2 bg-white rounded-xl mr-4 lg:mr-0 lg:ml-[-3px]">
                <div className="flex flex-row flex-wrap">
                  <div className="flex flex-row flex-wrap">
                    {product.colors.map((color) => (
                      <div
                        key={color.id}
                        className={`flex flex-col items-center mb-4 mx-2 cursor-pointer`}
                        onClick={() => handleColor(color.id)}>
                        <div
                          className={`w-[40px] h-[40px] rounded-md border
                          ${productDetails.color === color.id ? "border-black border-2" : "border"
                            }`}
                          style={{ backgroundColor: color.code }}
                        >
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="max-w-[120px]">
              <Input
                numeric={true}
                value={productDetails.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
              />
            </div>

            <div className="mt-4 no-select">
              <Button size="lg" className="h-[60px] bg-[#0a1d35] no-select"
                onClick={handleCart}
              >
                <ShoppingCart width={24} height={24} className="mr-2 no-select" />
                <div className="no-select" style={{ userSelect: "none" }}>Agregar al carrito</div>
              </Button>
            </div>
          </div>
        </div>

        {/**/}
        <div className="justify-end hidden lg:flex">
          <Carousel
            opts={{
              align: "end",
            }}
            className="w-full max-w-[448px]"
          >
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index} className="basis-1/3">
                  <div className="p-1 h-full w-full">
                    <div>
                      <div className="flex aspect-square items-center justify-center" style={{ userSelect: "none" }}>
                        <div className="relative w-full">
                          <div className="cursor-pointer" onClick={() => handleImage(image.url)}>
                            <img
                              src={image.url}
                              alt={product.name || "Product Image"}
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
      {/**/}

      <div className="mx-6 lg:mx-0 mt-8">
        <div className="w-full max-w-[900px] mx-auto font-semibold text-xl" style={{ userSelect: "none" }}>
          <div className="mb-1.5">Otros Productos</div>
        </div>

        <div className="flex justify-center mb-20">
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-full max-w-[900px]"
          >
            <div>
              <CarouselPrevious />
              <CarouselNext />
            </div>
            <CarouselContent>
              {relatedProducts.map((product, index) => (
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
              {/* Añadir cuadros vacíos si hay menos de 4 productos */}
              {Array.from({ length: 4 - relatedProducts.length }).map((_, index) => (
                <CarouselItem key={`placeholder-${index}`} className="basis-1/3 lg:basis-1/4">
                  <div className="p-1 h-full w-full">
                    <div className="flex aspect-square items-center justify-center bg-gray-200 rounded-xl">
                      <span className="text-gray-500">Slot vacio</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </React.Fragment >
  );
}

