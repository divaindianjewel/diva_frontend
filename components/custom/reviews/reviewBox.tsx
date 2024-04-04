"use client";
import React, { useEffect, useState } from "react";
import Reviews from "@/components/custom/reviews/reviews";
import ReviewFormDialog from "./review-form-dialog";
import axios from "axios";
import { domain } from "@/components/backend/apiRouth";

export interface ReviewProps {
  id: number;
  attributes: {
    product_id: number;
    ratting: number;
    Description: string;
    user_id: string;
    user_name: string;
  };
}

const CustomerReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${domain}/api/reviews`);
        // Filter the reviews based on the product ID
        const data = await response.json();
        const filteredReviews = data.data.filter(
          (review: ReviewProps) => review.attributes.product_id == productId
        );
        console.log(data);
        setReviews(filteredReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]); // Add productId to the dependency array

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl xl:mb-12">
          Customer Reviews
        </h2>

        <div className="mb-4 flex items-center justify-between border-t border-b py-4">
          <div className="flex flex-col gap-0.5">
            <span className="block font-bold">Write about our product</span>
          </div>

          <ReviewFormDialog productId={productId} edit={false} admin={true}/>
        </div>

        <div className="divide-y">
          {console.log(reviews)}
          {reviews.map((review) => (
            <Reviews key={review.id} review={review} admin={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
