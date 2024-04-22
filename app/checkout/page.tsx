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
import rupe from "@/app/assets/checkout/rupe.svg";
import mastercard from "@/app/assets/checkout/mastercard.svg";
import phonepe from "@/app/assets/checkout/phonpe.svg";
import gpay from "@/app/assets/checkout/gpay.svg";
import addOrder from "@/backend/shiprocket/addOrder";
import { MakePayment } from "@/app/api/Payment";
import { NextApiRequest, NextApiResponse } from "next";

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

const Page = () => {
  const router = useRouter();

  const [addressId, setAddressId] = useState();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { userId } = useAuth();
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

  useEffect(() => {
    const getUserData = async () => {
      const userResponse = await fetch(`${domain}/api/billing-addresses`, {
        method: "GET",
      });

      const data = await userResponse.json();

      console.log(data.data);
      const tmpUserData = data.data?.filter(
        (items: addressProps) => items.attributes.user_id == userId
      );

      console.log(tmpUserData);
      console.log(tmpUserData.length);
      if (tmpUserData.length > 0) {
        setDataPresent(true);
        setAddressId(tmpUserData[0].id);
        setFirstName(tmpUserData[0].attributes.first_name);
        setLastName(tmpUserData[0].attributes.last_name);
        setPhoneNumber(tmpUserData[0].attributes.phone_number);
        setEmail(tmpUserData[0].attributes.email);
        setCity(tmpUserData[0].attributes.city);
        setPinCode(tmpUserData[0].attributes.pincode);
        setAddress(tmpUserData[0].attributes.address);
        setState(tmpUserData[0].attributes.state);
      }
    };

    getUserData();
  }, [userId]);

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
        user_id: userId,
      };

      setTmpUserData(obj);

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
        if (selectedMethod == "online") {
          MakePayment(router, total);
        } else {
          warningTost("Selected COD");
          try {
            addOrder(obj, router, cartData, total);
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
        } else {
          successTost("Billing address added successfully");
        }

        if (selectedMethod == "online") {
          MakePayment(router, total);
        } else {
          warningTost("Selected COD");
          try {
            router.push("/shiprocket");
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };

  const handleMethodChange = (event: any) => {
    const selectedValue = event.target.id;
    setSelectedMethod(selectedValue);
    console.log(selectedValue);
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const userCartData = data.data.filter(
            (item: CartItem) => item.attributes.user_id === userId
          );
          setCartData(userCartData);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [userId]);

  useEffect(() => {
    let tmpsubtotal = 0;

    cartData.map(
      (item) =>
        (tmpsubtotal =
          tmpsubtotal + item.attributes.product_price * item.attributes.qnt)
    );
    setSubtotal(tmpsubtotal);

    const gst = tmpsubtotal * 0.03;

    const totalPrice = tmpsubtotal + gst;
    setTotal(totalPrice);
  }, [cartData]);

  const handleStateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newState = event.target.value as string;
    setState(newState);
    console.log(newState);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFirstName = event.target.value;
    setFirstName(newFirstName);
    console.log(newFirstName);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLastName = event.target.value;
    setLastName(newLastName);
    console.log(newLastName);
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
    console.log(newPhoneNumber);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    console.log(newEmail);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = event.target.value;
    setCity(newCity);
    console.log(newCity);
  };

  const handlePinCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPinCode = event.target.value;
    setPinCode(newPinCode);
    console.log(newPinCode);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    console.log(newAddress);
  };

  return (
    <>
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
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
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
              {cartData.map((item) => (
                <CartItems
                  key={item.id}
                  random={() => {}}
                  productId={item.attributes.Product_id}
                  cartId={item.id}
                  qnt={item.attributes.qnt}
                  show={false}
                  image={item.attributes.img}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator />

      <div className="flex flex-col md:flex-row items-center justify-center gap-5">
        <Card className="max-w-[70rem] w-[40rem] my-5">
          <CardHeader>
            <CardTitle className="text-center">Payment Method</CardTitle>
          </CardHeader>

          <div className="">
            <div className="plans flex flex-row">
              <label
                className={`plan basic-plan ${
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
                  <div className="plan-details">
                    <span>Pay online</span>
                    <p>Pay securely using card payment or by using UPI</p>
                    <div className="flex items-center">
                      <Image src={visa} width={50} alt="visa" />
                      <Image src={rupe} width={50} alt="rupe" />
                      <Image src={mastercard} width={50} alt="mastercard" />
                      <Image src={phonepe} width={50} alt="phonepe" />
                      <Image src={gpay} width={50} alt="gpay" />
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`plan complete-plan ${
                  selectedMethod === "cod" ? "active" : ""
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

        <Card className="max-w-[70rem] w-[30rem] my-5">
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
                  <div className="ml-auto">₹{(subtotal * 0.03).toFixed(2)}</div>
                </div>
                <div className="flex items-center font-medium">
                  <div>Total</div>
                  <div className="ml-auto">₹{total.toFixed(2)}</div>
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
    </>
  );
};

export default Page;
