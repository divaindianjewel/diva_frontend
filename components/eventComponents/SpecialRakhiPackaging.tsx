import React from "react";
import { Button } from "@/components/ui/button";

import img from "@/app/assets/rakhi packaging.jpg";
import Image from "next/image";
import Link from "next/link";

const SpecialRakhiPackaging = () => {
  return (
    <div className="mt-10">
      <section className="flex items-center justify-center gap-8 max-w-10xl mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Diva's Special Packaging
          </h2>
          <p className="text-muted-foreground">
            Get The Best Rakhi For Your Brother
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Basic Silver Rakhi</h3>
              <p className="text-muted-foreground">
                In This You will get the Rakhi At worth of ₹280
              </p>
              <div className="flex items-end gap-2 my-4">
                <span className="text-4xl font-bold">₹1299</span>
                <span className="text-muted-foreground">/Per Box</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Silver Rakhi At worth of ₹280
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Silver Coin
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Kum Kum box
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Akshada Box
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Cadbury Chocobakes
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  Ferrore rocher
                </li>
              </ul>
              <Link href={`/rakhi/301`}>
                <Button className="w-full mt-4">Buy Now</Button>
              </Link>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Special Silver Rakhi</h3>
              <p className="text-muted-foreground">
                In This You will get the Rakhi At worth of ₹550
              </p>
              <div className="flex items-end gap-2 my-4">
                <span className="text-4xl font-bold">₹1499</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Silver Rakhi At worth of ₹550
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Silver Coin
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Kum Kum box
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Akshada Box
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  1 Cadbury Chocobakes
                </li>
                <li>
                  <CheckIcon className="w-4 h-4 mr-2 inline-block text-primary" />
                  Ferrore rocher
                </li>
              </ul>
              <Link href={`/rakhi/300`}>
                <Button className="w-full mt-4">Buy Now</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block w-[30rem]">
          <Image
            src={img}
            alt="Product Image"
            width={500}
            height={500}
            className="aspect-square object-cover rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default SpecialRakhiPackaging;

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
