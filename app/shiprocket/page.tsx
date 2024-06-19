"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import addOrder from "@/backend/shiprocket/addOrder";
import { successTost } from "@/components/toast/allTost";
import Cookies from "js-cookie";

interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
    img: any;
  };
}

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

interface order {
  id: number;
  attributes: {
    user_id: string;
    order_date: string;
    total_price: number;
    discount: number;
    user_name: string;
    ordered: boolean;
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
  const { userId } = useAuth();
  const [userLocalId, setUserLocalId] = useState<string>("");
  const [orderId, setOrderId] = useState<number>();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<addressProps[]>();
  const [total, setTotal] = useState<number>(0);
  const [userObj, setUserObj] = useState<any>({});
  const [userName, setUserName] = useState<any>();
  const router = useRouter();
  // const [orderId, setOrderId] = useState<number>();
  const [discountAmount, setDiscountAmount] = useState<number>();
  const [orderInfo, setOrderInfo] = useState<order>();
  const [tmp, setTmp] = useState<boolean>(false);
  const [addressLoad, setAddressLoad] = useState<boolean>(false);
  const [cartDataLoad, setCartDataLoad] = useState<boolean>(false);
  const [isUpdateOrder, setIsUpdateOrder] = useState<boolean>(false);
  const [cookiesCartData, setCookiesCartData] = useState<cartItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // USER ADDRESS VARIABLES
  const [state, setState] = useState("Andhra Pradesh");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");

  // fetching cart Data from the Cookies
  useEffect(() => {
    const data = Cookies.get("DIVAcart");
    const cartData: cartItemProps[] = data ? JSON.parse(data) : [];

    console.log(cartData);
    setCookiesCartData(cartData);
    setLoading(false);
  }, [loading]);

  // GET USER ADDRESS
  useEffect(() => {
    const userData = Cookies.get("DIVAUserAddress");

    if (userData != undefined) {
      const newData: divaAddressProps = JSON.parse(userData);
      setFirstName(newData.first_name);
      setLastName(newData.last_name);
      setAddress(newData.address);
      setEmail(newData.email);
      setCity(newData.city);
      setPinCode(newData.pinCode);
      setPhoneNumber(newData.phone_number);
    }
  }, [userLocalId]);

  // GET ORDER-ID
  useEffect(() => {
    setLoading(true);
    const tmpOrderId = Cookies.get("DivaOrderId");
    setOrderId(Number(tmpOrderId));
    setLoading(false);
  }, [loading]);

  // UPDATING THE ORDER ID TO TRUE
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
    updateOrderId();
  }, [userId, orderId, isUpdateOrder]);

  useEffect(() => {
    const addOrderedProduct = async () => {
      console.log(cookiesCartData.length);
      cookiesCartData.map(async (item) => {
        let response = await fetch(`${domain}/api/ordered-products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              orderId: 54,
              productId: item.id,
              qnt: item.qnt,
              price: item.price,
              image: item.img,
              name: item.name,
              userid: "23",
            },
          }),
        });

        if (response.ok) {
          console.log("success...!!!");
        }
      });
    };
    addOrderedProduct();
  }, [cookiesCartData]);

  // useEffect(() => {
  //   let tmpsubtotal = 0;

  //   cartData.map(
  //     (item) =>
  //       (tmpsubtotal =
  //         tmpsubtotal + item.attributes.product_price * item.attributes.qnt)
  //   );
  //   const gst = tmpsubtotal * 0.03;

  //   const totalPrice = tmpsubtotal + gst;
  //   setTotal(totalPrice);
  // }, [cartData]);

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
