"use client";

import { domain } from "@/components/backend/apiRouth";
import { errorTost } from "@/components/toast/allTost";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { CiDiscount1 } from "react-icons/ci";
import { CalendarIcon, PackageIcon } from "lucide-react";
import Navbar from "@/components/custom/navbar";

interface Product {
  id: number;
  attributes: {
    orderId: number;
    productId: number;
    qnt: number;
    price: string;
    image: string;
    date: string;
    name: string;
    userid: string;
  };
}

const Page = () => {
  const params = useParams();
  let orderId = 0;
  if (params) {
    orderId = Number(params.id);
  }

  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(`${domain}/api/ordered-products`);
        const data = await response.json();

        const tmpProducts = data.data.filter(
          (items: Product) => items.attributes.orderId == orderId
        );
        setOrderedProducts(tmpProducts);
      } catch (error) {
        console.log(error);
        errorTost("something went wrong");
      }
    };

    getUserData();
  }, [orderId]);

  return (
    <div>
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
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
                    <CiDiscount1 className="h-6 w-6" />
                    <span className="font-semibold">
                      discount : ₹{product.attributes.orderId}
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

export default Page;