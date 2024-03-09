import React, { useEffect, useState } from "react";
import Image from "next/image";
import { domain } from "../backend/apiRouth";

import bannerImage from "@/app/assets/banners/banner-2.jpg";

interface Category {
  id: number;
  attributes: {
    name: string;
    home_pic: {
      data: {
        id: number;
        attributes: {
          name: string;
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

        setCategory(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return (
    <div>
      {/* {category &&
        category.attributes.home_pic &&
        category.attributes.home_pic.data && (
          <Image
            src={category.attributes.home_pic.data.attributes.url}
            width={2000}
            height={1000}
            alt={category.attributes.home_pic.data.attributes.name || "banner"}
          />
        )} */}
      <Image src={bannerImage} width={2000} height={1000} alt={"this is image"} />
    </div>
  );
};

export default CategoryBanner;
