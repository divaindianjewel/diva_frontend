"use client";
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { domain } from "../backend/apiRouth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface ProductData {
  id: number;
  attributes: {
    name: string;
    price: number;
    compare_price: number;
    images: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      }[];
    };
    category: {
      data: {
        id: number;
      };
    };
  };
}

const RakhiProducts: React.FC<{ price: number }> = ({ price }) => {
  const [selectedRakhi, setSelectedRakhi] = useState<string>("268");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${domain}/api/products?populate=*&filters[$and][0][category][id][$eq]=16`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();

        const filteredData = data.data.filter(
          (item: ProductData) => item.attributes.price === price
        );

        setProducts(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [price]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="no-scrollbar grid gap-6 w-fit mx-auto px-4 md:px-6 py-12 h-[35rem] overflow-y-scroll">
      <RadioGroup
        value={selectedRakhi}
        onValueChange={(value) => {
          console.log(value);
          setSelectedRakhi(value);
        }}
        className="flex flex-col gap-4 items-start"
      >
        {products.map((item, index) => (
          <div className="flex items-center gap-4" key={index}>
            <RadioGroupItem
              value={`${item.id}`}
              id={`${item.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={String(item.id)}
              className={`flex items-center gap-4 bg-card p-4 rounded-lg cursor-pointer w-full transition-colors hover:bg-muted 
              ${selectedRakhi == `${item.id}` ? "border-2 border-primary" : ""}
              peer-checked:bg-primary peer-checked:text-primary-foreground`}
            >
              <Image
                src={item.attributes.images.data[0].attributes.url}
                alt={item.attributes.images.data[0].attributes.name}
                width={120}
                height={120}
                className="rounded-lg"
                style={{ aspectRatio: "120/120", objectFit: "cover" }}
              />

              <div className="grid gap-1">
                <h3 className="font-semibold">{item.attributes.name}</h3>
                <p className="text-muted-foreground">
                  Price : {item.attributes.price}
                </p>
              </div>
              <Button>View Product</Button>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RakhiProducts;