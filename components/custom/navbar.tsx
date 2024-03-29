"use client";

import React, { useState } from "react";
import Image from "next/image";

// clerk
import { UserButton, useUser } from "@clerk/nextjs";

// Logo
import Logo from "@/app/assets/logo.png";
import Link from "next/link";

// react icons
import { FaShoppingCart } from "react-icons/fa";
import { TfiMenu } from "react-icons/tfi";
import { RxCross1 } from "react-icons/rx";
import TemporaryDrawer from "../mui/drawer";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  // console.log(open);

  interface NavItem {
    href: string;
    label: string;
  }

  const icon_size = "25";

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-10">
      <div className="bg-black h-[5.2rem] text-white flex items-center justify-between px-8">
        <div className="logo flex items-center justify-center">
          <div>
            <TemporaryDrawer />
          </div>
          <Link href="/">
            <Image src={Logo} alt="Logo" height={95} width={195} />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-x-10">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <ul className="flex items-center justify-evenly gap-x-14 text-xl">
              <Link className="hover:underline" href="/sign-in">
                Sign-in
              </Link>
              <Link className="hover:underline" href="/sign-up">
                Sign-up
              </Link>
            </ul>
          )}

          <Link href={"/cart"}>
            <div className="flex relative">
              <FaShoppingCart size={icon_size} className="cursor-pointer" />
              <label className="cart_counter" htmlFor="1">
                1
              </label>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
