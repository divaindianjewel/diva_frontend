"use client";
import React, { useEffect, useState, useRef } from "react";

// Logo
import Link from "next/link";
import { domain } from "../backend/apiRouth";
import { Product } from "./swiper/MensFeatureSection";

const SearchBar = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryProduct, setCategoryProduct] = useState<Product[]>();

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


  return <div>
    
  </div>;
};

export default SearchBar;
