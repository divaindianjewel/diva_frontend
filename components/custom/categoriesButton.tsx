"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { domain } from "../backend/apiRouth";

interface categories {
  id: number;
  attributes: {
    name: string;
  };
}

const CategoriesButton = () => {
  const [categoriesName, setCategoriesName] = useState<categories[] | null>(
    null
  );

  // Fetch data on component mount
  useEffect(() => {
    const fetchCategoriesName = async () => {
      try {
        const response = await fetch(
          `${domain}/api/categories?populate=*`
        );
        const data = await response.json();

        setCategoriesName(data.data);
      } catch (err) {
        console.log(`the error is : ${err}`);
      }
    };

    fetchCategoriesName();
  }, []);

  return (
    <div className="flex items-center justify-start gap-5 mx-5 max-w-[95vw] w-[93vw]  relative">
      {categoriesName?.map((items) => (
        <Link
          className="filterBtn drop-shadow-bg-gray-900 my-2"
          href={`/category/${items.id}`}
        >
          {items.attributes.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesButton;
