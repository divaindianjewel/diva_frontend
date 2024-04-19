import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, PackageIcon } from "lucide-react";
import React from "react";

const pages = () => {
  return (
    <div>
      <main className="flex-1 grid grid-rows-[auto_1fr] gap-4 p-4 md:grid-rows-[auto_1fr] md:gap-8 md:p-6">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl lg:text-3xl">
            Total Orders : 10
          </h1>

        </div>
        <div className="rounded-lg border divide-y dark:border-gray-800">
          <div className="flex items-center p-4 space-x-4">
            <div className="flex items-center space-x-2">
              <PackageIcon className="h-6 w-6" />
              <span className="font-semibold">Order-id : #3102</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 opacity-40" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Ordered on June 23, 2022
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  alt="Product image"
                  className="aspect-square rounded-md object-cover"
                  height="120"
                  src="/placeholder.svg"
                  width="120"
                />
                <div className="grid gap-1 text-sm">
                  <h2 className="font-semibold">Glimmer Lamps</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Product id: #GLM2201
                  </p>
                </div>
              </div>
              <div className="flex-1 grid gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="font-medium">Quantity:</div>
                    <div className="text-gray-500 dark:text-gray-400">x2</div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="font-medium">Price:</div>
                    <div>$60.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default pages;
