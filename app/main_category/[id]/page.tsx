"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";
import Navbar from "@/components/custom/navbar";

const Page = () => {
  let categoryId = 0;
  const params = useParams();
  if (params) {
    categoryId = Number(params.id);
  }

  return (
    <>
      <Navbar />
      <div>This is Category id : {categoryId}</div>
    </>
  );
};

export default Page;
