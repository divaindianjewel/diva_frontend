import Loader from "@/components/custom/Loader";
import React from "react";

const Page: React.FC = () => {
  const suggestions = ["Apple", "Banana", "Cherry", "Grape", "Lemon", "Orange"];

  return (
    <div>
      <Loader />
    </div>
  );
};

export default Page;
