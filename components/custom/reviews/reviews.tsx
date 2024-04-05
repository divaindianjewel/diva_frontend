"use client";
import React, { useEffect, useState } from "react";
import { ReviewProps } from "./reviewBox";

// react icons
import { IoIosStar } from "react-icons/io";
import { TiPencil } from "react-icons/ti";
import { FaTrashCan } from "react-icons/fa6";
import EditReviewFormDialog from "./review-edit-form";
import axios from "axios";
import { domain } from "@/components/backend/apiRouth";
import { errorTost, successTost } from "@/components/toast/allTost";

const Review: React.FC<{ review: ReviewProps; admin: boolean }> = ({
  review,
  admin,
}) => {
  const [randomNum, setRandomNum] = useState<number>();

  const deleteReview = async (reviewId: any) => {
    try {
      const response = await axios.delete(`${domain}/api/reviews/${reviewId}`);

      successTost("review deleted successfully");
    } catch (error) {
      errorTost("Something went wrong can't delete the review");
    }
  };
  return (
    <div key={randomNum} className="divide-y">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3 py-4 md:py-8">
          <div>
            <span className="block text-sm font-bold">
              {review.attributes.user_name}{" "}
            </span>
          </div>

          <div className="-ml-1 flex gap-0.5">
            {[...Array(review.attributes.ratting)].map((_, index) => (
              <IoIosStar key={index} color="gold" size={25} />
            ))}
          </div>

          <p className="text-gray-600">{review.attributes.Description}</p>
        </div>

        <div className="action flex items-center justify-between gap-5  br-0-5">
          <EditReviewFormDialog reviewId={review.id} />
          <div
            className="delete bg-red-600 p-[0.5rem] br-0-5"
            onClick={() => {
              deleteReview(review.id);
            }}
          >
            <FaTrashCan color="white" size={25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
