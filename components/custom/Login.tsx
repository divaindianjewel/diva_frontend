"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { errorTost, warningTost } from "../toast/allTost";
import { Button } from "../ui/button";
import { auth } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Cookies from "js-cookie";
import { domain } from "../backend/apiRouth";

const Login: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    console.log(fullName);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const handleLogin = async () => {
    try {
      console.log(email);
      console.log(password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      Cookies.set("DIVAIJ-USER", user.uid, { expires: 365 });
      alert("Login successfully");
      location.reload();
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
      Cookies.set("DIVAIJ-USER", user.uid, { expires: 365 });
      alert("Registration successfully");
      location.reload();
    } catch (error) {
      alert("Registration failed");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-fit">
      <motion.div
        key="authInput"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg w-80"
      >
        <h2 className="text-2xl mb-6 text-black font-semibold">
          {isRegister ? "Register Now" : "Login Now"}
        </h2>
        {isRegister && (
          <input
            type="text"
            className="p-2 border rounded-md w-full mb-4"
            value={fullName}
            onChange={handleFullNameChange}
            placeholder="Enter Full Name"
          />
        )}
        <input
          type="email"
          className="p-2 border rounded-md w-full mb-4"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter Email"
        />
        <input
          type="password"
          className="p-2 border rounded-md w-full mb-4"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter Password"
        />
        <Button
          onClick={isRegister ? handleRegister : handleLogin}
          className="w-full"
        >
          {isRegister ? "Register" : "Login"}
        </Button>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 underline mt-4"
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
