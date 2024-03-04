import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Category {
  id: number;
  attributes: {
    name: string;
    banner: {
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
        if (!categoryId) return; // Check if categoryId exists

        const response = await fetch(
          `http://localhost:1337/api/categories/${categoryId}?populate=*`
        );

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
      {category && (
        <Image
          src={category.attributes.banner?.data.attributes.url}
          width={2000}
          height={1000}
          alt={category.attributes.banner?.data.attributes.name || "banner"}
        />
      )}
    </div>
  );
};

export default CategoryBanner;
