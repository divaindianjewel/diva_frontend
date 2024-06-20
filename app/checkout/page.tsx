"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";
import CartItems from "@/components/custom/cartItems";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import FormControl from "@mui/material/FormControl";
import Image from "next/image";

import "./radio.css";

import {
  errorTost,
  successTost,
  warningTost,
} from "@/components/toast/allTost";
import cash from "@/app/assets/checkout/cash-on-delivery.png";
import visa from "@/app/assets/checkout/visa.svg";
import phonepe from "@/app/assets/checkout/phonpe.svg";
import gpay from "@/app/assets/checkout/gpay.svg";
import { MakePayment } from "@/app/api/Payment";
import { Input } from "@/components/ui/input";
import CreateOrderId from "@/backend/order/create-orderId";
import Navbar from "@/components/custom/navbar";
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
  pinCode: string;
  address: string;
}

const Page = () => {
  const router = useRouter();

  const [userLocalId, setUserLocalId] = useState<string>("");
  const [cookiesCartData, setCookiesCartData] = useState<cartItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressId, setAddressId] = useState();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  // const { userId } = useAuth();
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
  const [discountCodeText, setDiscountCodeText] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);

  // FUNCTION FOR APPLYING DISCOUNT
  const applyDiscount = async (code: string) => {
    const response = await fetch(`${domain}/api/discounts`);
    const data = await response.json();
    const filteredData: discounts[] = data.data.filter(
      (item: discounts) => item.attributes.code == code
    );
    if (!filteredData[0]) {
      errorTost("Invalid Discount Code!");
      return false;
    } else {
      const TmpDiscountAmount = filteredData[0].attributes.amount;
      setDiscountAmount(TmpDiscountAmount);
      setIsDiscounted(true);
      successTost("This Code is Available");
    }
  };

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
        if (!response.ok) {
          errorTost("Something went wrong");
          return;
        } else {
          successTost("Billing address added successfully");
        }

        try {
          const userName = firstName + " " + lastName;
          const total_items = cookiesCartData.length;

          const response = await CreateOrderId(
            total,
            discountAmount,
            userLocalId,
            userName,
            total_items
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
          errorTost("third create id");
          const response = await CreateOrderId(
            total,
            discountAmount,
            userLocalId,
            userName,
            total_items
          );
          console.log(response);
          Cookies.set("DivaOrderId", response.id, {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "Lax",
            path: "/",
            domain: window.location.hostname,
          });
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
    console.log(selectedValue);
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

    console.log(cartData);
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

  // handle state change functions
  const handleStateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newState = event.target.value as string;
    setState(newState);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFirstName = event.target.value;
    setFirstName(newFirstName);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLastName = event.target.value;
    setLastName(newLastName);
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = event.target.value;
    setCity(newCity);
  };

  const handlePinCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPinCode = event.target.value;
    setPinCode(newPinCode);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  };

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West bengal",
  ];

  return (
    <>
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row sm:items-center lg:items-start md:items-start  justify-center gap-5 ">
        <Card className="max-w-[50rem] w-fit my-7">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <FormControl fullWidth>
              <div id="state" className="my-3 w-[18rem]">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Select State
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: "Select Country",
                  }}
                  fullWidth
                  onChange={handleStateChange}
                >
                  {states.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div
                id="name"
                className="flex flex-col md:flex-row gap-5 justify-between my-3 w-[18rem]"
              >
                <TextField
                  id="standard-basic"
                  label="First name"
                  variant="outlined"
                  fullWidth
                  onChange={handleFirstNameChange}
                  value={firstName}
                />

                <TextField
                  id="standard-basic"
                  label="Last name"
                  variant="outlined"
                  fullWidth
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </div>

              <div
                id="phone"
                className="my-3 flex gap-5 flex-col md:flex-row w-[18rem]"
              >
                <TextField
                  id="standard-basic"
                  label="Phone Number"
                  variant="outlined"
                  type="number"
                  fullWidth
                  onChange={handlePhoneNumberChange}
                  value={phoneNumber}
                />
                <TextField
                  id="standard-basic"
                  label="Enter Email"
                  variant="outlined"
                  type="email"
                  fullWidth
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>

              <div
                id="info"
                className="flex gap-5  justify-between my-3 flex-col md:flex-row w-[18rem]"
              >
                <TextField
                  id="standard-basic"
                  label="City"
                  variant="outlined"
                  fullWidth
                  onChange={handleCityChange}
                  value={city}
                />

                <TextField
                  id="City"
                  label="pin-code"
                  variant="outlined"
                  fullWidth
                  onChange={handlePinCodeChange}
                  value={pinCode}
                />
              </div>

              <div id="address" className="my-3 w-[18rem]">
                <TextField
                  id="standard-basic"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  onChange={handleAddressChange}
                  value={address}
                />
              </div>
            </FormControl>
          </CardContent>
          <Separator />
        </Card>

        <Card className="max-w-[50rem] my-7 max-h-[30rem] w-fit overflow-y-scroll">
          <CardHeader>
            <CardTitle>My Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {cookiesCartData.map((item) => (
                <CartItems
                  key={item.id}
                  random={() => {}}
                  productId={item.id}
                  cartId={item.id}
                  qnt={item.qnt}
                  show={false}
                  image={item.img}
                  productName={item.name}
                  price={item.price}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-col lg:flex-row w-fit mx-auto gap-5">
        <Card className="max-w-[70rem] w-[22rem] md:w-[30rem] my-5 overflow-x-hidden ">
          <CardHeader>
            <CardTitle className="text-center">Payment Method</CardTitle>
          </CardHeader>

          <div className="w-fit">
            <div className="plans flex flex-row px-1 w-[22rem] md:w-[45rem] lg:w-[30rem] ">
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

          <CardContent></CardContent>
        </Card>

        <div className={`flex flex-col w-fit mx-0 md:mx-auto gap-5`}>
          <div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Enter discount code"
                className="w-full"
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
