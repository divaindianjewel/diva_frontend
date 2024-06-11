"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

// clerk
import { UserButton, useAuth, useUser } from "@clerk/nextjs";

// Logo
import Logo from "@/app/assets/logo.png";
import Link from "next/link";
import Cookies from "js-cookie";

// react icons
import { FaShoppingCart } from "react-icons/fa";
import TemporaryDrawer from "../mui/drawer";
import { domain } from "../backend/apiRouth";
import LoginDialog from "./LoginDialog";
import SearchDialog from "./SearchDialog";

const Navbar: React.FC<{ randomNum?: number }> = ({ randomNum }) => {
  const { userId } = useAuth();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

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
  }, [userId, randomNum]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const allSuggestions = ["Product 1", "Product 2", "Product 3", "Product 4"];

    if (searchTerm.length > 0) {
      const filteredSuggestions = allSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      const noSuggestion = ["No Product Found"];
      setSuggestions(noSuggestion);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setIsSearchActive(false);
    }
  };

  const handleScroll = () => {
    setIsSearchActive(false);
  };

  useEffect(() => {
    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchActive]);

  // Hardcoded categories and best-selling products
  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports"];
  const bestSellers = ["Best Seller 1", "Best Seller 2", "Best Seller 3"];

  return (
    <div>
      <nav className="sticky top-0 z-20">
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
            <SearchDialog />

            {Cookies.get("DIVAIJ-USER")?.length == undefined ? (
              <LoginDialog size={25} />
            ) : (
              " "
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

      <div className={isSearchActive ? "hidden" : "block"}></div>

      {isSearchActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      )}
    </div>
  );
};

export default Navbar;
