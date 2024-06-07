"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { domain } from "../backend/apiRouth";
import { Skeleton } from "../ui/skeleton";

interface categories {
  id: number;
  attributes: {
    name: string;
  };
}

const CategoriesButton: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const [categoriesName, setCategoriesName] = useState<categories[] | null>(
    null
  );
  const [ActiveCategoriesName, setActiveCategoriesName] = useState<
    categories | null
  >(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoriesName = async () => {
      try {
        const response = await fetch(`${domain}/api/categories?populate=*`);
        const data = await response.json();
        const tmpData: categories[] = data.data;
        const activeCategories = tmpData?.filter(
          (item) => item.id == categoryId
        );

        const tmpActive = activeCategories[0];
        setActiveCategoriesName(tmpActive);

        const categoriesBtn: categories[] = tmpData.filter(
          (item) => item.id != categoryId
        );

        setCategoriesName(categoriesBtn);
        setLoading(false);
      } catch (err) {
        console.log(`the error is : ${err}`);
      }
    };

    fetchCategoriesName();
  }, []);

  return loading ? (
    <div className="my-[10px] mx-4 flex items-center gap-5">
      <Skeleton className="h-[40px] w-[170px] skeleton-bg" />
      <Skeleton className="h-[40px] w-[170px] skeleton-bg" />
      <Skeleton className="h-[40px] w-[170px] skeleton-bg" />
      <Skeleton className="h-[40px] w-[170px] skeleton-bg" />
      <Skeleton className="h-[40px] w-[170px] skeleton-bg" />
      <Skeleton className="h-[40px] w-[170px] skeleton-bg" />
    </div>
  ) : (
    <div className="no-scrollbar flex items-center justify-start gap-5 mx-5 max-w-[95vw] w-[93vw]  relative overflow-x-scroll">
      <Link className="myBtn active p-2 drop-shadow-bg-gray-900 my-2" href={``}>
        <p className="max-content-width">
          {ActiveCategoriesName?.attributes.name}
        </p>
      </Link>
      {categoriesName?.map((items) => (
        <Link
          key={items.id}
          className="myBtn p-2 drop-shadow-bg-gray-900 my-2"
          href={`/category/${items.id}`}
        >
          <p className="max-content-width">{items.attributes.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesButton;
