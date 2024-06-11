"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";
import Navbar from "@/components/custom/navbar";
import FadingBanner from "@/components/custom/Fade";

const Page = () => {
  let categoryId = 0;
  const params = useParams();
  if (params) {
    categoryId = Number(params.id);
  }

  return (
    <>
      <FadingBanner />
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
      <div>This is Category id : {categoryId}</div>
    </>
  );
};

export default Page;
