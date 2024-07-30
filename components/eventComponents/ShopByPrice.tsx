import React from "react";
import "./css/style.css";

import img999 from "@/app/assets/price/999.jpg";
import img2999 from "@/app/assets/price/2999.jpg";
import img4999 from "@/app/assets/price/4999.jpg";
import Image from "next/image";
import Link from "next/link";

const ShopByPrice = () => {
  const img = [
    {
      img: img999,
      price: 999,
    },
    {
      img: img2999,
      price: 2999,
    },
    {
      img: img4999,
      price: 4999,
    },
  ];

  return (
    <div className="container">
      <h1 className="title mt-5">Shop by Price</h1>
      <div className="flex items-center justify-evenly mb-5">
        {img.map((item, index) => (
          <Link href={`/price/${item.price}`} key={index}>
            <Image
              src={item.img}
              alt="index"
              height={200}
              width={200}
              className="mt-6 w-[200px]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopByPrice;
