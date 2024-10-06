import type { Metadata } from "next";
import * as React from "react"
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedProducts from "@/components/FeaturedProducts";

export const metadata: Metadata = {
  title: "Cranberry",
  description: "Hacemos envios a todo el pais.",
};

export default function HomePage() {
  return (
    <React.Fragment>
      <div className="container mx-auto mb-6">
        <img
          src="/images/banner.png"
          width={400}
          height={300}
          alt="banner"
          className="w-full"
        />
      </div>

      <div className="container mx-auto mt-16 pt-1 mb-6 overflow-hidden">
        <FeaturedCategories />
      </div>

      <div className="container mx-auto mt-1 pt-1 mb-20 overflow-hidden">
        <FeaturedProducts />
      </div>
    </React.Fragment>
  );
}
