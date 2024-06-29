"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";
// import Navbar from "../components/custom/navbar";
import Navbar from "../../../components/custom/navbar";
import FadingBanner from "../../../components/custom/Fade";
import { domain } from "../../../components/backend/apiRouth";
import Link from "next/link";
import Image from "next/image";


interface categories {
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

const Page = () => {

  let categoryId = 0;

  const params = useParams();
  if (params) {
    categoryId = Number(params.id);
  }

  const [category, setCategory] = useState<categories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCategory = async () => {
      const res = await fetch(
        `${domain}/api/categories?populate=*&filters[$and][0][main_category][id][$eq]=${categoryId}`
      );
      const data = await res.json();
      setCategory(data.data);

      setLoading(false);
    };

    getCategory();
  }, [loading, categoryId]);

  const categoriesImgClass = "rounded-full border-2 border-yellow-600 my-5";

  const width = 200;
  const height = 200;

  return (
    <>
      <FadingBanner />
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
      <div>

        {category.map((item, index) => (
          <Link href={`/category/${item.id}`} key={index} >
            <div className="flex items-center justify-center flex-col">
              <Image
                src={`${item.attributes.home_pic.data.attributes.url}`}
                alt="category"
                width={width}
                height={height}
                className={`${categoriesImgClass} w-[4.3rem] md:w-[10rem] lg:w-[15rem]`}
              />
              <h2 className="text-sm md:text-lg lg:text-xl mb-10 w-[5rem] md:w-[13rem] lg:w-[18rem] overflow-hidden whitespace-nowrap overflow-ellipsis">
                {item.attributes.name}
              </h2>
            </div>
          </Link>
        ))}

      </div>

    </>
  );
};

export default Page;
