"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  let categoryId = 0;
  const params = useParams();
  if (params) {
    categoryId = Number(params.id);
  }

  return <div>This is Category id : {categoryId}</div>;
};

export default page;
