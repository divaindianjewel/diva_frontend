"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// clerk
import { UserButton, useAuth, useUser } from "@clerk/nextjs";

// Logo
import Logo from "@/app/assets/logo.png";
import Link from "next/link";

// react icons
import { FaShoppingCart } from "react-icons/fa";
import TemporaryDrawer from "../mui/drawer";
import { FaUser } from "react-icons/fa";
import { domain } from "../backend/apiRouth";



const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId } = useAuth();
  const [totalCart, setTotalCart] = useState<number>(0);

  // console.log(open);

  interface NavItem {
    href: string;
    label: string;
  }

  const icon_size = "25";

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const userCartData: any[] = data.data.filter(
            (item: any) => item.attributes.user_id === userId
          );

          const tmp = userCartData.length;
          setTotalCart(tmp);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [userId]);

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-10">
      <div className="bg-black h-[5.2rem] text-white flex items-center justify-between lg:px-10 sm:px-6">
        <div className="logo flex items-center justify-center">
          <div>
            <TemporaryDrawer />
          </div>
          <Link href="/">
            <Image src={Logo} alt="Logo" height={95} width={195} />
          </Link>
        </div>

        <div className="flex items-center justify-center gap-5 mr-[2rem]">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <ul className="flex items-center justify-evenly lg:text-xl md:text-xl">
              <Link
                className="hover:underline lg:text-xl md:text-lg sm:text-sm px-5"
                href="/sign-up"
              >
                <FaUser size={25} />
              </Link>
            </ul>
          )}

          <Link href={"/cart"}>
            <div className="flex relative">
              <FaShoppingCart size={icon_size} className="cursor-pointer" />
              <label className="cart_counter" htmlFor="1">
                {totalCart}
              </label>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;