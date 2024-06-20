"use client";
import { domain } from "@/components/backend/apiRouth";
import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
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
  const [orderId, setOrderId] = useState<OrderId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderIds, setOrderIds] = useState<string[]>([]);

  useEffect(() => {
    const getUserOrders = async () => {
      orderIds.map(async (item) => {
        let response = await fetch(`${domain}/api/orders/${item}`);
        let data = await response.json();

        let tmp = [...orderId];

        tmp.push(data.data);
        setOrderId(tmp);
      });
    };
    getUserOrders();
  }, [loading]);

  useEffect(() => {
    const ids = Cookies.get("divaOrders");
    const data: string[] = ids ? JSON.parse(ids) : [];
    const filterData = data.filter((item) => item != "0");

    console.log(filterData);
    setOrderIds(filterData);
    setLoading(false);
  }, [loading]);

  return (
    <div>
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
      <main>
        <div className="container my-5 flex gap-3 flex-wrap">
          {orderId.map((item: OrderId) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 max-w-3xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Summary</h1>
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order #{item.id}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Discount
                  </p>
                  <p className="text-base font-medium">
                    ₹{item.attributes.discount}
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
      </main>
    </div>
  );
};

export default Pages;