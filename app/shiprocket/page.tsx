"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { domain } from "../../components/backend/apiRouth";
import addOrder from "../../backend/shiprocket/addOrder";
import Cookies from "js-cookie";

export interface addressProps {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    email: string;
    phone_number: number;
    user_id: string;
  };
}

interface cartItemProps {
  id: number;
  name: string;
  img: string;
  price: number;
  qnt: number;
}

interface divaAddressProps {
  id: number;
  state: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  pinCode: string;
  address: string;
}

const Page = () => {
  const [userLocalId, setUserLocalId] = useState<string>("null");
  const [orderId, setOrderId] = useState<number>(0);
  const [userObj, setUserObj] = useState<any>({});
  const [discount, setDiscount] = useState<string>("0");
  const [total, setTotal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState<boolean>(true);
  const router = useRouter();

  const [isUpdateOrder, setIsUpdateOrder] = useState<boolean>(false);
  const [cookiesCartData, setCookiesCartData] = useState<cartItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderLoading, setOrderLoading] = useState<boolean>(true);

  // fetching cart Data from the Cookies
  useEffect(() => {
    const data = Cookies.get("DIVAcart");
    const cartData: cartItemProps[] = data ? JSON.parse(data) : [];
    setCookiesCartData(cartData);
    setLoading(false);
  }, [loading]);

  // GET TOTAL AND DISCOUNTED AMOUNT
  useEffect(() => {
    const getDiscountedAmount = async () => {
      const res = await fetch(`${domain}/api/orders/${orderId}`);
      const data = await res.json();
      if (data.data !== null) {
        console.log(data.data.attributes.discount);
        console.log(data.data.attributes.total_price);
        setTotal(data.data.attributes.total_price);
        setDiscount(data.data.attributes.discount);
      }
    };

    getDiscountedAmount();
  }, [orderId]);

  // GET USER ADDRESS
  useEffect(() => {
    const userData = Cookies.get("DIVAUserAddress");

    if (userData != undefined) {
      const newData: divaAddressProps = JSON.parse(userData);
      setUserObj(newData);
    }
  }, [userLocalId]);

  // GET USER ID
  useEffect(() => {
    const tmpUserId = Cookies.get("DIVAIJ-USER");

    setUserLocalId(String(tmpUserId));
  }, []);

  // GET ORDER-ID
  useEffect(() => {
    setLoading(true);
    const tmpOrderId = Cookies.get("DivaOrderId");
    setOrderId(Number(tmpOrderId));
    setLoading(false);
  }, [loading]);

  // GETTING THE PAYMENT METHOD

  useEffect(() => {
    const getPaymentMethod = async () => {
      const res = await fetch(`${domain}/api/orders/${orderId}`);

      const data = await res.json();

      console.log(orderId);
      console.log(data.data.attributes.payment_method);
      setPaymentMethod(data.data.attributes.payment_method);

      setPaymentLoading(false);
    };

    getPaymentMethod();
  }, [orderId, paymentLoading, loading]);

  const addOrderCookies = (addOrderCookies: string) => {
    let orderArr = Cookies.get("divaOrders");

    let data: string[] = orderArr ? JSON.parse(orderArr) : [];

    data.push(addOrderCookies);

    Cookies.set("divaOrders", JSON.stringify(data), {
      expires: 365 * 3,
      secure: window.location.protocol === "https:",
      sameSite: "Lax",
      path: "/",
      domain: window.location.hostname,
    });
  };

  useEffect(() => {
    const updateOrderId = async () => {
      const response = await fetch(`${domain}/api/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({
          data: {
            data: {
              ordered: true,
            },
          },
        }),
      });
      if (response.ok) {
        setIsUpdateOrder(true);
      }
    };

    const addOrderedProduct = async () => {
      cookiesCartData.map(async (item) => {
        let response = await fetch(`${domain}/api/ordered-products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            data: {
              orderId: orderId,
              productId: item.id,
              qnt: item.qnt,
              price: item.price,
              image: item.img,
              name: item.name,
              userid: userLocalId,
            },
          }),
        });

        if (response.ok) {
          console.log("success...!!!");
        }
      });

      await addOrder(
        userObj,
        router,
        cookiesCartData,
        total,
        orderId,
        Number(discount),
        paymentMethod
      );

      addOrderCookies(String(orderId));

      Cookies.remove("DivaOrderId");
      Cookies.remove("DIVAcart");

      setOrderLoading(false);
    };

    const stockHandling = async () => {
      cookiesCartData.map(async (item) => {
        console.log(item.id);
        let response = await fetch(`${domain}/api/products/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              stock: 0,
            },
          }),
        });

        if (response.ok) {
          console.log("success...!!!");
        }
      });
    };

    addOrderedProduct();
    updateOrderId();
    stockHandling();
  }, [orderLoading]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <svg
          className="animate-spin h-8 w-8 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          please wait your order is placing
        </p>
      </div>
    </div>
  );
};

export default Page;
