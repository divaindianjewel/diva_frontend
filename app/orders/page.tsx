"use client";
import { domain } from "@/components/backend/apiRouth";
import { errorTost } from "@/components/toast/allTost";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { CalendarIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// discount icons
import { CiDiscount1 } from "react-icons/ci";

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
    userid: string;
  };
}

interface OrderId {
  id: number;
  attributes: {
    user_id: string;
    order_date: string;
    total_price: number;
    discount: number;
    user_name: string;
    ordered: boolean;
    total_product: number;
  };
}

const Pages = () => {
  
  const { userId } = useAuth();
  const [orderId, setOrderId] = useState<OrderId[]>([]);
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getUserOrders = async () => {
      const response = await fetch(`${domain}/api/orders`);
      const data = await response.json();

      const tmpData = data.data.filter(
        (item: OrderId) => item.attributes.user_id == userId
      );

      setOrderId(tmpData);
    };

    getUserOrders();
  }, [userId]);

  console.log(orderId);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(`${domain}/api/ordered-products`);
        const data = await response.json();

        const tmpProducts = data.data.filter(
          (items: Product) => items.attributes.userid == userId
        );
        setOrderedProducts(tmpProducts);
      } catch (error) {
        console.log(error);
        errorTost("something went wrong");
      }
    };

    getUserData();
  }, [userId]);

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

      <section>
        <div className="flex gap-3 flex-wrap">
          {orderId.map((item: OrderId) => (
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Summary</h1>
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order #${item.id}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Discount
                  </p>
                  <p className="text-base font-medium">
                    -₹{item.attributes.discount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Order Date
                  </p>
                  <p className="text-base font-medium">
                    {item.attributes.order_date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Items
                  </p>
                  <p className="text-base font-medium">
                    {item.attributes.total_product}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Price (without discount)
                  </p>
                  <p className="text-base font-medium">
                    ₹{item.attributes.total_price}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Price (with discount)
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{item.attributes.total_price - item.attributes.discount}
                  </p>
                </div>

                <div>
                  <Link href={`orders/${item.id}`}>
                    <Button>View All Products</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pages;
