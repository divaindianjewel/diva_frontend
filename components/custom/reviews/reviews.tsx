import React from "react";
import { IoIosStar } from "react-icons/io";
import { ReviewProps } from "./reviewBox";

const Review: React.FC<{ review: ReviewProps }> = ({ review }) => {
  return (
    <div className="divide-y">
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
    </div>
  );
};

export default Review;
