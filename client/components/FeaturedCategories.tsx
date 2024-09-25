"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="absolute right-4 top-6 transform -translate-y-1/2 p-2 bg-[#0a1d35] h-[40px] w-[40px] rounded-lg shadow flex items-center justify-center" onClick={onClick}>
      <HiOutlineArrowRight className="text-white" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="absolute right-16 top-6 transform -translate-y-1/2 p-2 bg-[#d7d7d7] h-[40px] w-[40px] rounded-lg shadow flex items-center justify-center" onClick={onClick}>
      <HiOutlineArrowLeft className="text-gray-900" />
    </div>
  );
};

export default function FeaturedCategories() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <div className="absolute ml-4 text-xl mt-3 font-semibold">Categorias</div>
      <Slider {...settings} className="flex pt-10 relative">
        <div className="p-4">
          <div className="flex flex-col justify-between min-h-[200px] h-full p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold">Card 1</h3>
            <p>Contenido de la tarjeta 1</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between min-h-[200px] h-full p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold">Card 2</h3>
            <p>Contenido de la tarjeta 2, con un texto más largo que el anterior.</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between min-h-[200px] h-full p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold">Card 3</h3>
            <p>Contenido de la tarjeta 3</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between min-h-[200px] h-full p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold">Card 4</h3>
            <p>Contenido de la tarjeta 4, con otro texto largo para probar la altura uniforme.</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between min-h-[200px] h-full p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold">Card 5</h3>
            <p>Contenido de la tarjeta 5</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between min-h-[200px] h-full p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold">Card 6</h3>
            <p>Contenido de la tarjeta 6</p>
          </div>
        </div>
      </Slider>
    </React.Fragment>
  );
}
