"use client";
import React, { useEffect, useState, useCallback } from "react";
import ReviewFormDialog from "./review-form-dialog";
import { domain } from "@/components/backend/apiRouth";
import { errorTost, successTost } from "@/components/toast/allTost";
import axios from "axios";
import { IoIosStar } from "react-icons/io";
import EditReviewFormDialog from "./review-edit-form";
import { FaTrashCan } from "react-icons/fa6";
import { useAuth } from "@clerk/nextjs";
import Cookies from "js-cookie";

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
    console.error("Error editing review:", error);
    throw error;
  }
};

export interface ReviewProps {
  id: number;
  attributes: {
    product_id: number;
    ratting: number;
    Description: string;
    user_id: string;
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
  const [userReview, setUserReview] = useState<ReviewProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocalId, setUserLocalId] = useState<string>("");

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const res = await fetch(
          `${domain}/api/reviews?filters[$and][0][product_id][$eq]=${productId}`
        );

        const data = await res.json();

        console.log(data.data);

        setReviews(data.data);

        const filterData = data.data.filter(
          (item: ReviewProps) => item.attributes.user_id === userLocalId
        );

        console.log(filterData);

        setUserReview(filterData[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [productId, userLocalId, randomNum]);

  useEffect(() => {
    const cookie = Cookies.get("DIVAIJ-USER") || "null";
    setUserLocalId(cookie);
    setLoading(true);
  }, []);

  const deleteReview = async (reviewId: number) => {
    try {
      await axios.delete(`${domain}/api/reviews/${reviewId}`);
      generateRandomNumber();
      successTost("Review deleted successfully");
      setLoading(true);
    } catch (error) {
      errorTost("Something went wrong, can't delete the review");
    }
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 15 + 1);
    setRandomNum(randomNumber);
  };

  return (
    <div className="py-6 sm:py-8 lg:py-12 max-h-[60rem] h-fit bg-white overflow-y-scroll">
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
            randomNum={randomNum}
          />
        </div>

        <div className="divide-y">
          {userReview && (
            <div key={userReview.id} className="divide-y">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3 py-4 md:py-8">
                  <div className="-ml-1 flex gap-0.5">
                    {[...Array(userReview.attributes.ratting)].map(
                      (_, index) => (
                        <IoIosStar key={index} color="gold" size={25} />
                      )
                    )}
                  </div>
                  <p className="text-gray-600">
                    {userReview.attributes.Description}
                  </p>
                </div>

                <div className="action flex items-center justify-between gap-5 cursor-pointer br-0-5">
                  <EditReviewFormDialog
                    random={generateRandomNumber}
                    reviewId={userReview.id}
                  />

                  <div
                    className="delete bg-red-600 p-[0.5rem] br-0-5 cursor-pointer"
                    onClick={() => {
                      deleteReview(userReview.id);
                    }}
                  >
                    <FaTrashCan color="white" size={25} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {reviews
            .filter((review) => review.attributes.user_id !== userLocalId)
            .map((review) => (
              <div key={review.id} className="divide-y">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3 py-4 md:py-8">
                    <div className="-ml-1 flex gap-0.5">
                      {[...Array(review.attributes.ratting)].map((_, index) => (
                        <IoIosStar key={index} color="gold" size={25} />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      {review.attributes.Description}
                    </p>
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
