"use client"

import { domain } from "@/components/backend/apiRouth";
import axios from "axios";
import { useState } from "react";

export const getTotalReview = async (product_id: number) => {
  const [total, setTotal] = useState<number>(0);
  const response = await axios.get(`${domain}/api/reviews`);

  setTotal(response.data.meta.pagination.total);
  return total;
};
