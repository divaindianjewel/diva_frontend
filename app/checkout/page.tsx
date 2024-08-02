"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";
import CartItems from "../../components/custom/cartItems";
import { domain } from "../../components/backend/apiRouth";
import FormControl from "@mui/material/FormControl";
import Image from "next/image";

import "./radio.css";

import {
  errorTost,
  successTost,
  warningTost,
} from "../../components/toast/allTost";
import cash from "../../app/assets/checkout/cash-on-delivery.png";
import visa from "../../app/assets/checkout/visa.svg";
import phonepe from "../../app/assets/checkout/phonpe.svg";
import gpay from "../../app/assets/checkout/gpay.svg";
import { MakePayment } from "../../app/api/Payment";
import { Input } from "../../components/ui/input";
import CreateOrderId from "../../backend/order/create-orderId";
import Navbar from "../../components/custom/navbar";
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

interface addressProps {
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

interface discounts {
  id: number;
  attributes: {
    code: string;
    amount: number;
    Number_of_times: number;
    Condition: string;
    discount_type: string;
  };
}

export interface cartItemProps {
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
  pincode: string;
  address: string;
}

const Page = () => {
  const router = useRouter();

  const [userLocalId, setUserLocalId] = useState<string>("");
  const [cookiesCartData, setCookiesCartData] = useState<cartItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressId, setAddressId] = useState<string>("");
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [state, setState] = useState("Andhra Pradesh");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("online");
  const [tmpUserData, setTmpUserData] = useState<any>();
  const [dataPresent, setDataPresent] = useState<boolean>(false);
  const [billingLoading, setBillingLoading] = useState<boolean>(true);

  // DISCOUNT STATES
  const [discountCodeText, setDiscountCodeText] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);

  const [discountType, setDiscountType] = useState<string>("");

  // FUNCTION FOR APPLYING DISCOUNT
  const applyDiscount = async (code: string) => {
    const response = await fetch(`${domain}/api/discounts`);
    const data = await response.json();
    const filteredData: discounts[] = data.data.filter(
      (item: discounts) => item.attributes.code == code
    );

    const discountInfo = filteredData[0];

    if (!discountInfo) {
      errorTost("Invalid Discount Code!");
      return false;
    } else {
      const TmpDiscountAmount = discountInfo.attributes.amount;
      const tmpDiscountType = discountInfo.attributes.discount_type;
      
      setDiscountType(tmpDiscountType);
      setDiscountAmount(TmpDiscountAmount);
      
      setIsDiscounted(true);
      successTost("This Code is Available");
    }
  };

  // GETTING Address Id
  useEffect(() => {
    const BillingId = Cookies.get("BillingId");
    setAddressId(String(BillingId));
    setBillingLoading(false);
  }, [billingLoading]);

  // GET USER ADDRESS
  useEffect(() => {
    const userData = Cookies.get("DIVAUserAddress");

    if (userData != undefined) {
      const newData: divaAddressProps = JSON.parse(userData);
      console.log(newData);
      setFirstName(newData.first_name);
      setLastName(newData.last_name);
      setAddress(newData.address);
      setEmail(newData.email);
      setCity(newData.city);
      setPinCode(newData.pincode);
      setState(newData.state);
      setPhoneNumber(newData.phone_number);
      setDataPresent(true);
    } else {
      setDataPresent(false);
    }
  }, [userLocalId]);

  const handelPay = async (e: any) => {
    e.preventDefault;
    if (
      !state ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !city ||
      !pinCode ||
      !address
    ) {
      errorTost("Please Fill All information of Billing Address");
    } else {
      const obj = {
        first_name: firstName,
        last_name: lastName,
        address: address,
        city: city,
        pincode: String(pinCode),
        state: state,
        country: "India",
        email: email,
        phone_number: String(phoneNumber),
        user_id: userLocalId,
      };
      setTmpUserData(obj);

      Cookies.set("DIVAUserAddress", JSON.stringify(obj), {
        expires: 365,
        secure: window.location.protocol === "https:",
        sameSite: "Lax",
        path: "/",
        domain: window.location.hostname,
      });

      if (!dataPresent) {
        const response = await fetch(`${domain}/api/billing-addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              ...obj,
            },
          }),
        });

        const data = await response.json();

        Cookies.set("BillingId", data.data.id, {
          expires: 365,
          secure: window.location.protocol === "https:",
          sameSite: "Lax",
          path: "/",
          domain: window.location.hostname,
        });

        if (!response.ok) {
          errorTost("Something went wrong");
          return;
        } else {
          successTost("Billing address added successfully");
        }

        try {
          const userName = firstName + " " + lastName;
          const total_items = cookiesCartData.length;
          const tmpCity = city + " - " + pinCode;

          const response = await CreateOrderId(
            total,
            discountAmount,
            userLocalId,
            userName,
            total_items,
            address,
            tmpCity,
            state,
            selectedMethod
          );

          Cookies.set("DivaOrderId", response.id, {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "Lax",
            path: "/",
            domain: window.location.hostname,
          });
        } catch (error) {
          errorTost("something went wrong while creating orderId");
          console.log(error);
        }

        if (selectedMethod == "online") {
          if (!isDiscounted) {
            MakePayment(router, total);
          } else {
            if (discountAmount != undefined) {
              MakePayment(router, total - discountAmount);
            }
          }
        } else {
          warningTost("Selected COD");
          try {
            router.push("/shiprocket");
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        const response = await fetch(
          `${domain}/api/billing-addresses/${addressId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                ...obj,
              },
            }),
          }
        );

        if (!response.ok) {
          errorTost("Something went wrong");
          return;
        }

        try {
          const userName = firstName + " " + lastName;
          const total_items = cookiesCartData.length;
          const tmpCity = city + " - " + pinCode;

          errorTost("third create id");

          const response = await CreateOrderId(
            total,
            discountAmount,
            userLocalId,
            userName,
            total_items,
            address,
            tmpCity,
            state,
            selectedMethod
          );

          Cookies.set("DivaOrderId", String(response.id), {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "Lax",
            path: "/",
            domain: window.location.hostname,
          });

          const tmp = Cookies.get("DivaOrderID");
        } catch (error) {
          console.log(error);
        }

        if (selectedMethod == "online") {
          if (!isDiscounted) {
            MakePayment(router, total);
          } else {
            if (discountAmount != undefined) {
              MakePayment(router, total - discountAmount);
            }
          }
        } else {
          router.push("/shiprocket");
        }
      }
    }
  };

  const handleMethodChange = (event: any) => {
    const selectedValue = event.target.id;
    setSelectedMethod(selectedValue);
  };

  // fetching cart Data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const userCartData = data.data.filter(
            (item: CartItem) => item.attributes.user_id == userLocalId
          );
          setCartData(userCartData);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [userLocalId]);

  // fetching cart Data from the Cookies
  useEffect(() => {
    const cookieCartData = Cookies.get("DIVAcart");
    const cartData: cartItemProps[] = cookieCartData
      ? JSON.parse(cookieCartData)
      : [];

    setCookiesCartData(cartData);
    setLoading(false);
  }, [loading]);

  // fetching total price
  useEffect(() => {
    let tmpsubtotal = 0;
    cookiesCartData.map(
      (item) => (tmpsubtotal = tmpsubtotal + item.price * item.qnt)
    );
    setSubtotal(tmpsubtotal);
    const gst = tmpsubtotal * 0.03;
    const totalPrice = tmpsubtotal + gst;
    setTotal(totalPrice);
  }, [cartData, cookiesCartData]);

  // GETTING USER ID
  useEffect(() => {
    setLoading(true);
    const userLocalId1 = Cookies.get("DIVAIJ-USER");
    if (userLocalId1 != undefined) {
      setUserLocalId(userLocalId1);
      setLoading(false);
    }
  }, [loading, userLocalId]);

  return (
    <>

      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>

      <div className="flex items-center justify-center px-3 flex-col w-fit mx-auto gap-5">
        <Card className="my-5">
          
          <CardHeader>
            <CardTitle className="text-center">Payment Method</CardTitle>
          </CardHeader>

          <div className="w-fit">
            <div className="plans flex flex-row px-1">
              <label
                className={`plan basic-plan w-[20rem] md:w-[25rem] ${
                  selectedMethod === "online" ? "active" : ""
                }`}
                htmlFor="online"
              >

                <input
                  checked={selectedMethod === "online"}
                  onChange={handleMethodChange}
                  type="radio"
                  name="paymentMethod"
                  id="online"
                />

                <div className="plan-content">
                  <div className="plan-details w-[10rem]">
                    <span>Pay online</span>
                    <p>Pay securely using card payment or by using UPI</p>
                    <div className="flex justify-evenly px-1 w-[20rem]">
                      <Image
                        className="w-[25%]"
                        src={visa}
                        width={50}
                        alt="visa"
                      />
                      <Image
                        className="w-[25%]"
                        src={phonepe}
                        width={50}
                        alt="phonepe"
                      />
                      <Image
                        className="w-[25%]"
                        src={gpay}
                        width={50}
                        alt="gpay"
                      />
                    </div>
                  </div>
                </div>

              </label>

              <label
                className={`plan complete-plan w-[20rem] md:w-[25rem] ${
                  selectedMethod === "cod w-[20rem]" ? "active" : "w-[20rem]"
                }`}
                htmlFor="cod"
              >
                <input
                  checked={selectedMethod === "cod"}
                  onChange={handleMethodChange}
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                />
                <div className="plan-content">
                  <Image src={cash} alt="" width={100} />
                  <div className="plan-details">
                    <span>Cash On Delivery</span>
                    <p>
                      Pay with cash or online UPI when you receive your order.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Card>

        <div className={`flex flex-col w-fit mx-0 md:mx-auto gap-5`}>
          <div>
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Enter discount code"
                className="w-[70%]"
                type="text"
                disabled={isDiscounted}
                onChange={(e) => {
                  setDiscountCodeText(e.target.value);
                }}
                value={discountCodeText}
              />
              <Button
                onClick={async () => {
                  await applyDiscount(discountCodeText);
                }}
                disabled={isDiscounted}
                className="w-[30%]"
              >
                Apply
              </Button>
            </div>

            {isDiscounted ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setDiscountCodeText("");
                  setIsDiscounted(false);
                }}
              >
                <p className="text-red-800 font-bold mt-3 ml-4">
                  {" "}
                  remove discount Code{" "}
                </p>
              </div>
            ) : (
              " "
            )}
          </div>

          <Card className="md:w-[30rem] w-[22rem] mx-auto my-5">
            <CardHeader>
              <CardTitle className="text-center">Total Bill</CardTitle>
            </CardHeader>
            <div className="w-full flex justify-end mr-10 mt-10">
              <div className="w-[30rem] max-w-[40rem] ">
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div>Subtotal</div>
                    <div className="ml-auto">₹{subtotal.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>GST (3%)</div>
                    <div className="ml-auto">
                      ₹{(subtotal * 0.03).toFixed(2)}
                    </div>
                  </div>
                  {isDiscounted ? (
                    <div className="flex  gap-4">
                      <div>DISCOUNT</div>
                      <div className="ml-auto">₹ -{discountAmount}</div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex items-center font-medium">
                    <div>Total</div>
                    <div className="ml-auto">
                      ₹
                      {discountAmount
                        ? isDiscounted
                          ? total - discountAmount
                          : total
                        : total}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={(e) => {
                      handelPay(e);
                    }}
                  >
                    Proceed to pay
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
