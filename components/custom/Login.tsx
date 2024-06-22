"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { errorTost, warningTost } from "../toast/allTost";
import { Button } from "../ui/button";
import { auth } from "../../firebase/config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Cookies from "js-cookie";
import { domain } from "../backend/apiRouth";

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [realPhoneNum, setRealPhoneNum] = useState<string | undefined>();
  const [user, setUser] = useState<any>(null);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const sendOtp = async () => {
    if (phoneNumber.length != 10 && realPhoneNum != undefined) {
      warningTost("Please Enter a valid phone Number");
    } else {
      try {
        const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
        if (realPhoneNum != undefined) {
          const confirmation = await signInWithPhoneNumber(
            auth,
            realPhoneNum,
            recaptcha
          );
          setUser(confirmation);
        }
      } catch (error) {
        alert("something went wrong");
        console.log(error);
      }
      setStep(2);
    }
  };

  const verifyOtp = async () => {
    try {
      const data = await user.confirm(otp);
      const localId = data._tokenResponse.localId;
      Cookies.set("DIVAIJ-USER", localId, { expires: 365 });
      console.log(Cookies.get("DIVAIJ-USER"));

      const response = await fetch(
        `${domain}/api/user-ids?filters[$and][0][number][$eq]=${phoneNumber}`
      );

      const userData = await response.json();

      if (userData.data) {
        const addResponse = await fetch(`${domain}/api/user-ids`, {
          method: "POST",
          body: JSON.stringify({
            data: {
              number: Number(phoneNumber),
              localId: localId,
            },
          }),
        });

        if (addResponse.ok) {
          alert("Login successfully");
          location.reload();
        } else {
          alert("something went wrong");
        }
      } else {
        alert("Login successfully");
        location.reload();
      }
    } catch (error) {
      alert("OTP is wrong");
      errorTost("Something went wrong");
      console.log(error);
    }
  };

  const changePhoneNumber = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-fit">
      {step === 1 ? (
        <motion.div
          key="phoneInput"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg"
        >
          <h2 className="text-2xl mb-6 text-black font-semibold">
            Login with Phone Number
          </h2>
          <div className="flex items-center mb-4">
            <span className="p-2 bg-gray-200 border border-r-0 rounded-l-md text-black">
              +91
            </span>
            <input
              type="number"
              className="p-2 border rounded-r-md flex-1"
              value={phoneNumber}
              onChange={(e: any) => {
                setRealPhoneNum("+91" + e.target.value);
                handlePhoneNumberChange(e);
              }}
              placeholder="Enter Your Phone Number"
            />      
          </div>
          <div id="recaptcha" className="mb-3"></div>
          <Button onClick={() => sendOtp()} className="w-full">
            Send OTP
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="otpInput"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8"
        >
          <h2 className="text-2xl mb-6 text-black">Enter OTP</h2>
          <p className="mb-4">OTP sent to +91 {phoneNumber}</p>
          <input
            type="number"
            className="p-2 border rounded-r-md flex-1"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
          />
          <div className="flex flex-col items-start w-full justify-start gap-4 mt-3">
            <Button onClick={verifyOtp} className="w-full">
              Verify OTP
            </Button>
            <button
              onClick={changePhoneNumber}
              className="text-blue-500 underline"
            >
              Change Phone Number
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
