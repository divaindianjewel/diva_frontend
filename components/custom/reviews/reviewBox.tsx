// CustomerReviews.jsx
import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
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
        const response = await axios.get(`${domain}/api/reviews`);
        setReviews(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl xl:mb-12">
          Customer Reviews
        </h2>

        <div className="mb-4 flex items-center justify-between border-t border-b py-4">
          <div className="flex flex-col gap-0.5">
            <span className="block font-bold">Total</span>

            {/* stars - start */}
            <div className="-ml-1 flex gap-0.5">
              <IoIosStar color="gold" size={25} />

              {/* Add the remaining star SVGs */}
            </div>
            {/* stars - end */}

            <span className="block text-sm text-gray-500">
              Based on 27 reviews
            </span>
          </div>

          <ReviewFormDialog productId={productId} />
        </div>

        <div className="divide-y">
          {reviews.map((review) => (
            <Reviews review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
