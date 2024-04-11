"use client";
import React, { useEffect, useState } from "react";
import Reviews from "@/components/custom/reviews/reviews";
import ReviewFormDialog from "./review-form-dialog";
import { domain } from "@/components/backend/apiRouth";
import { errorTost, successTost } from "@/components/toast/allTost";
import axios from "axios";
import { IoIosStar } from "react-icons/io";
import EditReviewFormDialog from "./review-edit-form";
import { FaTrashCan } from "react-icons/fa6";

export const generateRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  return randomNumber;
};

export const EditReview = async (
  rating: number,
  description: string,
  reviewId: number
) => {
  try {
    const response = await axios.put(`${domain}/api/reviews/${reviewId}`, {
      data: {
        ratting: rating,
        Description: description,
      },
    });
    console.log("Review Edited successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: any) => {
  try {
    const response = await axios.delete(`${domain}/api/reviews/${reviewId}`);

    successTost("review deleted successfully");
  } catch (error) {
    errorTost("Something went wrong can't delete the review");
  }
};

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

export const addReview = async (
  productId: number,
  rating: number,
  description: string,
  userId: string,
  userName: string
) => {
  try {
    const response = await axios.post(`${domain}/api/reviews`, {
      data: {
        product_id: productId,
        ratting: rating,
        Description: description,
        user_id: userId,
        user_name: userName,
      },
    });
    console.log("Review added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
const CustomerReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const [randomNum, setRandomNum] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewProps[]>([]);

  const deleteReview = async (reviewId: any) => {
    try {
      const response = await axios.delete(`${domain}/api/reviews/${reviewId}`);
      generateRandomNumber();
      successTost("review deleted successfully");
    } catch (error) {
      errorTost("Something went wrong can't delete the review");
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${domain}/api/reviews`);
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
  }, [productId, randomNum]);

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 15 + 1);
    setRandomNum(randomNumber);
  };

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

          <ReviewFormDialog
            random={generateRandomNumber}
            productId={productId}
          />
        </div>
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="divide-y">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3 py-4 md:py-8">
                  <div>
                    <span className="block text-sm font-bold">
                      {review.attributes.user_name}
                    </span>
                  </div>

                  <div className="-ml-1 flex gap-0.5">
                    {[...Array(review.attributes.ratting)].map((_, index) => (
                      <IoIosStar key={index} color="gold" size={25} />
                    ))}
                  </div>

                  <p className="text-gray-600">
                    {review.attributes.Description}
                  </p>
                </div>

                <div className="action flex items-center justify-between gap-5 cursor-pointer br-0-5">
                  <EditReviewFormDialog
                    random={generateRandomNumber}
                    reviewId={review.id}
                  />
                  <div
                    className="delete bg-red-600 p-[0.5rem] br-0-5 cursor-pointer"
                    onClick={() => {
                      deleteReview(review.id);
                    }}
                  >
                    <FaTrashCan color="white" size={25} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
