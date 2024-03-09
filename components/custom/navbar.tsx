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
        <div className="logo">
          <Link href="/">
            <Image src={Logo} alt="Logo" height={95} width={195} />
          </Link>
        </div>

        <ul className="hidden lg:flex  items-center justify-evenly gap-x-14 text-xl">
          {navItems.map((items) => (
            <Link
              key={items.href}
              className="hover:underline"
              href={items.href}
            >
              {items.label}
            </Link>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-x-10">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <ul className="hidden lg:flex  items-center justify-evenly gap-x-14 text-xl">
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

          {open ? (
            <RxCross1
              size="30"
              className="cursor-pointer lg:hidden md:block"
              onClick={() => {
                setOpen(!open);
              }}
            />
          ) : (
            <TfiMenu
              size={icon_size}
              className="cursor-pointer lg:hidden md:block"
              onClick={() => {
                setOpen(!open);
              }}
            />
          )}
        </div>
      </div>
      <div
        className={`bg-black text-white second-nav transition-all  ease-in-out delay-100 ${
          open ? "showNav h-fit" : "hideNav h-0"
        } `}
      >
        <ul className="flex flex-col items-center justify-evenly gap-x-14 text-xl">
          {navItems.map((items) => (
            <Link
              key={items.href}
              className="border border-white w-full py-3"
              href={items.href}
            >
              {items.label}
            </Link>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
