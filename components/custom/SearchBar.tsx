"use client";
import React, { useEffect, useState, useRef } from "react";

// Logo
import Link from "next/link";
import { domain } from "../backend/apiRouth";
import { Product } from "./swiper/MensFeatureSection";

const SearchBar = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryProduct, setCategoryProduct] = useState<Product[]>();

  const allSuggestions = ["Product 1", "Product 2", "Product 3", "Product 4"];
  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports"];
  const bestSellers = ["Best Seller 1", "Best Seller 2", "Best Seller 3"];

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

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
    const fetchData = async () => {
      let currentPage = 1;
      let totalPages = 1;
      let fetchedProducts = [];

      while (currentPage <= totalPages) {
        const products = await fetchProducts(currentPage);
        fetchedProducts.push(...products.data);
        totalPages = products.meta.pagination.pageCount;
        currentPage++;
      }

      const productsArray = Object.values(fetchedProducts);
      setAllProducts(productsArray);

      const tmp = productsArray.flat();

      // const categoryProduct = tmp.filter(
      //   (i: Product) => i.attributes.category.data.id == categoryId
      // );

      setCategoryProduct(categoryProduct);
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchProducts = async (page: number) => {
    const response = await fetch(
      `${domain}/api/products?populate=*&pagination[pageSize]=100&pagination[page]=${page}`
    );
    return response.json();
  };

  useEffect(() => {
    const getProductName = async () => {
      const data = await fetch(`${domain}/api/products`);
    };
  }, []);

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

  return (
    <div
      className="flex-grow flex items-center justify-center mx-5 relative"
      ref={searchBoxRef}
    >
      <input
        type="text"
        className="w-full h-10 px-5 rounded-full text-black"
        placeholder="Search..."
        value={searchTerm}
        onFocus={() => setIsSearchActive(true)}
        onChange={handleSearchChange}
      />

      {(suggestions.length > 0 || searchTerm.length === 0) &&
        isSearchActive && (
          <div className="absolute top-12 bg-white text-black rounded-md shadow-lg w-full p-4 z-30">
            {searchTerm.length === 0 ? (
              <>
                <h3 className="text-start font-bold mb-2">Categories</h3>
                <ul>
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="text-start px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(category);
                        setSuggestions([]);
                        setIsSearchActive(false); // Hide suggestions on selection
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>

                <h3 className="text-start font-bold mt-4 mb-2">Best Sellers</h3>

                <ul>
                  {bestSellers.map((product, index) => (
                    <li
                      key={index}
                      className="text-start px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(product);
                        setSuggestions([]);
                        setIsSearchActive(false);
                      }}
                    >
                      {product}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="text-start px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setSuggestions([]);
                    setIsSearchActive(false);
                  }}
                >
                  {suggestion}
                </div>
              ))
            )}
          </div>
        )}
    </div>
  );
};

export default SearchBar;
