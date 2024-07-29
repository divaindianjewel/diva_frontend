"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
} from "../../components/ui/card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/custom/navbar";
import { domain } from "@/components/backend/apiRouth";
import { useRouter } from "next/navigation";
import { errorTost } from "@/components/toast/allTost";

interface userAddress {
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
    phone_number: string;
    user_id: string;
  };
}

const Page = () => {
  const router = useRouter();

  const [state, setState] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [billingId, setBillingId] = useState<number>();
  const [userId, setUserId] = useState<string | null>();

  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoading, setUserLoading] = useState<boolean>(true);

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

  const handleAddressChange = (event: any) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  };

  const handleBilling = async (e: any) => {
    let tmpUserId = userId != null ? userId : null;

    const bodyData = {
      data: {
        first_name: firstName,
        last_name: lastName,
        address: address,
        city: city,
        pinCode: pinCode,
        state: state,
        country: "India",
        email: email,
        phone_number: phoneNumber,
        user_id: tmpUserId,
      },
    };

    try {
      let res;
      if (billingId) {
        alert("working");
        res = await fetch(`${domain}/api/billing-addresses/${billingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });
      } else {
        res = await fetch(`${domain}/api/billing-addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });
      }

      if (res.ok) {
        const data = await res.json();

        const id = data.data.id;

        Cookies.set("BillingId", id, {
          expires: 365,
          secure: window.location.protocol === "https:",
          sameSite: "Lax",
          path: "/",
          domain: window.location.hostname,
        });

        router.push("/checkout");
      } else {
        const errorData = await res.json();
        errorTost(`Something went wrong - ${res.status}: ${errorData.message}`);
      }
    } catch (error: any) {
      errorTost(`Something went wrong - Network error: ${error.message}`);
    }
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

  useEffect(() => {
    const getData = async () => {
      const tmpBillingId = Cookies.get("BillingId");
      setBillingId(Number(tmpBillingId));
      setLoading(false);

      const res = await fetch(
        `${domain}/api/billing-addresses/${tmpBillingId}`
      );

      const data = await res.json();
      const info: userAddress = data.data;

      setFirstName(info.attributes.first_name);
      setLastName(info.attributes.last_name);
      setAddress(info.attributes.address);
      setPhoneNumber(info.attributes.phone_number);
      setCity(info.attributes.city);
      setPinCode(info.attributes.pincode);
      setState(info.attributes.state);
      setEmail(info.attributes.email);
      setLoading(false);
    };

    getData();
  }, [loading]);

  // GETTING THE USER DATA
  useEffect(() => {
    const data = Cookies.get("DIVAIJ-USER");

    const tmpUserId = data ? data : null;

    setUserId(tmpUserId);
    setUserLoading(false);
  }, [userLoading]);

  return (
    <>
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <Card className="max-w-[80vw] w-fit my-7">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <FormControl fullWidth>
              <div id="state" className="my-3 w-[25rem]">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Select State
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: "Select Country",
                  }}
                  fullWidth
                  value={state}
                  onChange={handleStateChange}
                >
                  <option selected disabled>
                    Select State
                  </option>

                  {states.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div
                id="name"
                className="flex flex-col md:flex-row gap-5 justify-between my-3 w-[25rem]"
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
                className="my-3 flex gap-5 flex-col md:flex-row w-[25rem]"
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
                className="flex gap-5  justify-between my-3 flex-col md:flex-row w-[25rem]"
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

              <div id="address" className="my-3 w-[25rem]">
                <textarea
                  id="standard-basic"
                  onChange={(e) => {
                    handleAddressChange(e);
                  }}
                  value={address}
                  className="w-full resize-none border border-gray-500 px-2 py-1 text-gray-600 rounded-md"
                  placeholder="Address"
                  rows={5}
                ></textarea>
              </div>

              <button
                onClick={(e) => {
                  handleBilling(e);
                }}
                className="w-full bg-zinc-900 text-white py-3 rounded-lg text-lg"
              >
                Checkout now
              </button>
            </FormControl>
          </CardContent>
          <Separator />
        </Card>
      </div>
    </>
  );
};

export default Page;
