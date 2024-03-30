"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import axios from "axios";
import { generateRandomId } from "@/backend/phonepe/payment-form";

interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
    img : any
  };
}

export const setUserData = (obj: any) => {
  return obj;
};

const page = () => {
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
  const [userData, setUserData] = useState<any>();

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
        pincode: pinCode,
        state: state,
        country: "India",
        email: email,
        phone_number: phoneNumber,
        user_id: userId,
      };

      setUserData(obj);

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

      // const data = await response.json();
      // console.log("Address :", data);

      if (selectedMethod == "online") {
        warningTost("selected online");
      } else {
        warningTost("Selected COD");
        try {
          const shiprocketResponse = await fetch(
            "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + process.env.NEXT_PUBLIC_SHIPROCKET_ID
              },

              body: JSON.stringify({
                order_id: `OR-${generateRandomId(10)}`,
                order_date: "2024-03-27 11:11",
                pickup_location: "Primary",
                channel_id: "4854844",
                comment: "Reseller: M/s Goku",
                billing_customer_name: "Rushikesh",
                billing_last_name: "Shrimanwar",
                billing_address: "House 221B, Leaf Village",
                billing_address_2: "Near Hokage House",
                billing_city: "Nanded",
                billing_pincode: "110002",
                billing_state: "maharastra",
                billing_country: "India",
                billing_email: "rushikeshshrimanwar@gmail.com",
                billing_phone: "9579896842",
                shipping_is_billing: true,
                shipping_customer_name: "Rushikesh",
                shipping_last_name: "Shrimanwar",
                shipping_address: "shrinager nanded",
                shipping_address_2: "shrinager nanded",
                shipping_city: "nanded",
                shipping_pincode: "431605",
                shipping_country: "india",
                shipping_state: "Maharashtra",
                shipping_email: "rushikeshshrimanwar@gmail.com",
                shipping_phone: "9579896842",
                order_items: [
                  {
                    name: "Kunai",
                    sku: "chakra123",
                    units: 10,
                    selling_price: "900",
                    discount: "",
                    tax: "",
                    hsn: 441122,
                  },
                ],
                payment_method: "Online",
                shipping_charges: 0,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: 9000,
                length: 10,
                breadth: 15,
                height: 20,
                weight: 2.5,
              }),
            }
          );

          if (shiprocketResponse.ok) {
            successTost("Order shipped successfully");
          } else {
            errorTost("something went wrong");
          }
        } catch (error) {
          console.log(error);
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
  }, []);

  useEffect(() => {
    let tmpsubtotal = 0;

    cartData.map(
      (item) =>
        (tmpsubtotal =
          tmpsubtotal + item.attributes.product_price * item.attributes.qnt)
    );
    setSubtotal(tmpsubtotal);

    const gst = tmpsubtotal * 0.18;

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
      <div className="flex lg:flex-row md:flex-row sm:flex-col sm:items-center lg:items-start md:items-start  justify-center gap-5">
        <Card className="max-w-[50rem] w-[40rem] my-7">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <FormControl fullWidth>
              <div id="state" className="my-3">
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

              <div id="name" className="flex gap-5  justify-between my-3 ">
                <TextField
                  id="standard-basic"
                  label="First name"
                  variant="outlined"
                  fullWidth
                  onChange={handleFirstNameChange}
                />

                <TextField
                  id="standard-basic"
                  label="Last name"
                  variant="outlined"
                  fullWidth
                  onChange={handleLastNameChange}
                />
              </div>

              <div id="phone" className="my-3 flex gap-5">
                <TextField
                  id="standard-basic"
                  label="Phone Number"
                  variant="outlined"
                  type="number"
                  fullWidth
                  onChange={handlePhoneNumberChange}
                />
                <TextField
                  id="standard-basic"
                  label="Enter Email"
                  variant="outlined"
                  type="email"
                  fullWidth
                  onChange={handleEmailChange}
                />
              </div>

              <div id="info" className="flex gap-5  justify-between my-3 ">
                <TextField
                  id="standard-basic"
                  label="City"
                  variant="outlined"
                  fullWidth
                  onChange={handleCityChange}
                />

                <TextField
                  id="City"
                  label="pin-code"
                  variant="outlined"
                  fullWidth
                  onChange={handlePinCodeChange}
                />
              </div>

              <div id="address" className="my-3">
                <TextField
                  id="standard-basic"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  onChange={handleAddressChange}
                />
              </div>
            </FormControl>
          </CardContent>
          <Separator />
        </Card>

        <Card className="max-w-[50rem] w-[40rem] my-7 max-h-[30rem] overflow-y-scroll">
          <CardHeader>
            <CardTitle>My Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {cartData.map((item) => (
                <CartItems
                  key={item.id}
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

      <div className="flex items-center justify-center gap-5">
        <Card className="max-w-[70rem] w-[40rem] my-5">
          <CardHeader>
            <CardTitle className="text-center">Payment Method</CardTitle>
          </CardHeader>

          <div className="container">
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
                  <div className="ml-auto">₹{(subtotal * 0.3).toFixed(2)}</div>
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

export default page;
