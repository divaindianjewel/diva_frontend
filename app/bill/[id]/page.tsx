"use client";
import { domain } from "../../../components/backend/apiRouth";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OrderInfo {
  id: number;
  attributes: {
    user_id: string;
    order_date: string;
    total_price: number;
    discount: number;
    user_name: string;
    ordered: boolean;
    total_product: number;
    address: string;
    city: string;
    state: string;
    payment_method: string;
  };
}

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

const Page = () => {
  // GETTING THE ORDER ID
  const params = useParams();
  let orderId = 0;
  if (params) {
    orderId = Number(params.id);
  }

  const [loading, setLoading] = useState<boolean>(true);

  const [orderInfo, setOrderInfo] = useState<OrderInfo>();

  const [orderLoader, setOrderLoader] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>();

  //   Product Array
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);

  //   Function for getting the product Array
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(
          `${domain}/api/ordered-products?populate=*&filters[$and][0][orderId][$eq]=${orderId}`
        );
        const data = await response.json();
        setOrderedProducts(data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getUserData();
  }, [orderId, loading]);

  //   Function to getting Order Information
  useEffect(() => {
    const getOrderInfo = async () => {
      const res = await fetch(`${domain}/api/orders/${orderId}`);
      const data = await res.json();
      setOrderInfo(data.data);
      setOrderLoader(false);
    };
    getOrderInfo();
  }, [orderId, orderLoader]);

  return (
    <div className="bg-background text-foreground p-8 sm:p-12 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="grid grid-cols-2 gap-6 text-sm" id="bill">
        <div>
          <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
          <p className="capitalize">
            {orderInfo?.attributes.user_name}
            <br />
            {orderInfo?.attributes.address}
            <br />
            {orderInfo?.attributes.city}
            <br />
            {orderInfo?.attributes.state}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-4">Order #{orderId}</h2>
          <p className="text-muted-foreground">
            {orderInfo?.attributes.order_date}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left py-2 pr-4">Item</th>
                <th className="text-right py-2 pr-4">Qty</th>
                <th className="text-right py-2 pr-4">Unit Price</th>
                <th className="text-right py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderedProducts.map((item: Product, index) => (
                <tr key={index} className="border-b border-muted">
                  <td className="py-4 pr-4">{item.attributes.name}</td>
                  <td className="text-right py-4 pr-4">
                    {item.attributes.qnt}
                  </td>
                  <td className="text-right py-4 pr-4">
                    ₹{item.attributes.price}
                  </td>
                  <td className="text-right py-4 pr-4">
                    $
                    {Number(item.attributes.price) *
                      Number(item.attributes.qnt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          <p>
            Payment Method:{" "}
            {orderInfo?.attributes.payment_method === "cod"
              ? "Cash On delivery"
              : "Online"}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Subtotal:</div>
            <div>₹{orderInfo?.attributes.total_price}</div>
            <div className="text-muted-foreground">Discount:</div>
            <div>₹{orderInfo?.attributes.discount}</div>
            <div className="font-bold">Total:</div>
            <div className="font-bold">
              ₹
              {orderInfo != undefined
                ? orderInfo?.attributes.total_price -
                  orderInfo?.attributes.discount
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
