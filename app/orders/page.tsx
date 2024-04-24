"use client";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import { CalendarIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  attributes: {
    orderId: string;
    productId: string;
    qnt: string;
    createdAt: string;
    updatedAt: string;
    price: string;
    image: string;
    date: string;
    name: string;
  };
}

const Pages = () => {
  const { userId } = useAuth();
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);

  fetch("https://diva-backend-iukkr.ondigitalocean.app/api/ordered-products")
    .then((response) => response.json())
    .then((data) => setOrderedProducts(data.data))
    .catch((error) => console.error("Error fetching data:", error));

  return (
    <div>
      <main className="flex-1 grid grid-rows-[auto_1fr] gap-4 p-4 md:grid-rows-[auto_1fr] md:gap-8 md:p-6">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl lg:text-3xl">
            Total Orders Products : {orderedProducts.length}
          </h1>
        </div>
        {orderedProducts.map((product, index) => (
          <>
            <Link
              key={index}
              href={`/products/${product.attributes.productId}`}
            >
              <div
                key={product.id}
                className="rounded-lg border divide-y dark:border-gray-800"
              >
                <div className="flex items-center p-4 space-x-4">
                  <div className="flex items-center space-x-2">
                    <PackageIcon className="h-6 w-6" />
                    <span className="font-semibold">
                      Order-id : #{product.attributes.orderId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 opacity-40" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Ordered on {product.attributes.date}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="120"
                        src={product.attributes.image}
                        width="120"
                      />
                      <div className="grid gap-1 text-sm">
                        <h2 className="font-semibold">
                          {product.attributes.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Product id: #{product.attributes.productId}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 grid gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="font-medium">Quantity:</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            x{product.attributes.qnt}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="font-medium">Price:</div>
                          <div>₹{product.attributes.price}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </>
        ))}
      </main>
    </div>
  );
};

export default Pages;
