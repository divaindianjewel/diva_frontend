import React, { useEffect, useState } from "react";
import Image from "next/image";
import { domain } from "../backend/apiRouth";

import bannerImage from "@/app/assets/banners/banner-2.jpg";

interface Category {
  id: number;
  attributes: {
    name: string;
    bannner: {
      data: {
        id: number;
        attributes: {
          url: string;
        };
      };
    };
  };
}

interface CategoryId {
  categoryId: number;
}

const CategoryBanner: React.FC<CategoryId> = ({ categoryId }) => {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (!categoryId) return;

        const response = await fetch(
          `${domain}/api/categories/${categoryId}?populate=*`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }

        const data = await response.json();

        setCategory(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const bannerURL = category?.attributes.bannner.data.attributes.url;

  return (
    <div>
      {
        <Image
          src={bannerURL}
          alt="Home Banner Image"
          width={1519}
          height={30}
        />
      }
    </div>
  );
};

export default CategoryBanner;
