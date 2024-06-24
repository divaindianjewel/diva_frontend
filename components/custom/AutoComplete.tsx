"use client";
import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { Product } from "./swiper/WomensFeatureSection";
import { domain } from "../backend/apiRouth";
import Link from "next/link";
import Loader from "./Loader";

export function AutoComplete() {
  const [loading, setLoading] = useState<boolean>(true);
  const [productName, setProductName] = useState<string[]>([""]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

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

      // Use a Set to track unique product names
      const uniqueProducts = [];
      const productNames = new Set();

      for (const product of productsArray) {
        const name = product.attributes.name;
        if (!productNames.has(name)) {
          productNames.add(name);
          uniqueProducts.push(product);
        }
      }

      setAllProducts(uniqueProducts);
      setLoading(false);
    };

    fetchData();
  }, [loading]);

  const fetchProducts = async (page: number) => {
    const response = await fetch(
      `${domain}/api/products?populate=*&pagination[pageSize]=100&pagination[page]=${page}`
    );
    return response.json();
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Categories">
          <CommandItem>
            <span>1 Gram Gold Mangalsutra</span>
          </CommandItem>
          <CommandItem>
            <span>Fusion Kada And Bracelet</span>
          </CommandItem>
          <CommandItem>
            <span>Sterling Silver Belt Bracelet </span>
          </CommandItem>
          <CommandItem>
            <span> Sterling Silver Bracelet for women's </span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Products">
          {loading ? (
            <Loader />
          ) : (
            allProducts.map((item: Product, index) => (
              <Link key={index} href={`/search/${item.attributes.name}`}>
                <CommandItem>
                  <span>{item.attributes.name}</span>
                </CommandItem>
              </Link>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
