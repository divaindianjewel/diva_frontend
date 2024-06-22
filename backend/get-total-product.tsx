"use client";

import { Product } from "../app/category/[id]/page";
import { domain } from "../components/backend/apiRouth";
import React, { useState, useEffect } from "react";

export const getAllProduct = () => {
  const [products, setProducts] = useState<Product[]>();
  const [meta, setMeta] = useState<number>();

  useEffect(() => {
    const getData = async () => {
      const metaRes = await fetch(
        `${domain}/api/products?populate=*&pagination[pageSize]=100`
      );

      const metaData = await metaRes.json();

      if (!metaData) return;

      setMeta(metaData.meta.pagination.pageCount);

      if (meta != undefined) {
        for (let i = 1; i <= meta; i++) {
          let res = await fetch(
            `${domain}/api/products?populate=*&pagination[pageSize]=100&pagination[pageCount] = ${i}`
          );

          let product = await res.json();

          let productData = product.data;

          let productArray = [];
          productArray.push(productData);
          //   setProducts(product);

          console.log(productArray);
        }
      }
    };

    getData();
  }, []);
};
