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

interface categories {
  id: number;
  attributes: {
    name: string;
  };
}

export function AutoComplete() {
  const [loading, setLoading] = useState<boolean>(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<categories[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(
        `${domain}/api/categories?filters[$and][0][Show_in_search_bar][$eq]=true`
      );
      const data = await res.json();
      setCategories(data.data);
      setCategoriesLoaded(false);
    };
    fetchCategories();
  }, [categoriesLoaded]);

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
          {categories.map((item, index) => (
            <Link key={index} href={`/category/${item.id}`}>
              <CommandItem>
                <span>{item.attributes.name}</span>
              </CommandItem>
            </Link>
          ))}
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
