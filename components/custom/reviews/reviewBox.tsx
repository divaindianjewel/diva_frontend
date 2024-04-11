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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { auth, useAuth, useUser } from "@clerk/nextjs";

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
  const starSize = 30;

  const [rating, setRating] = useState<number>(0);
  const [stars, setStars] = useState<string[]>(["", "", "", "", ""]);
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId } = useAuth();

  const setStar = (index: number) => {
    const newStars = stars.map((_, i) => (i < index ? "gold" : ""));
    setStars(newStars);
    setRating(index);
  };

  const reviewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      if (userId != null && userId != undefined) {
        let userName = "User";
        if (user != null) {
          userName = user.firstName + " " + user.lastName;
        }
        await addReview(productId, rating, description, userId, userName)
          .then(() => {
            setIsOpen(false);
            successTost("your review added successfully");
          })
          .catch((error) => {
            console.error("Error submitting review:", error);
          });

        const num = generateRandomNumber();
        setRandomNum(num);
      }
    } else {
      e.preventDefault();
      errorTost("Please Login first");
    }
  };

  const deleteReview = async (reviewId: any) => {
    try {
      const response = await axios.delete(`${domain}/api/reviews/${reviewId}`);
      const num = generateRandomNumber();
      setRandomNum(num);
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
  }, [productId, randomNum, userId]);

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

          <section>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger>
                <button
                  type="button"
                  className="inline-block rounded-lg border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base"
                >
                  Write a review
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review</DialogTitle>
                  <DialogDescription>
                    <form onSubmit={reviewSubmitHandler}>
                      <div className="flex items-center justify-center gap-4 mt-3">
                        {stars.map((color, index) => (
                          <IoIosStar
                            key={index}
                            cursor={"pointer"}
                            size={starSize}
                            color={color}
                            onClick={() => setStar(index + 1)}
                          />
                        ))}
                      </div>

                      <Textarea
                        placeholder="Write your review"
                        className="mt-4"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />

                      <div className="flex items-center justify-center mt-4">
                        <button
                          type="submit"
                          className="text-white bg-gray-900 p-3 border rounded-lg"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </DialogDescription>
                  {isOpen && (
                    <DialogClose
                      onClick={() => setIsOpen(false)}
                      aria-label="Close dialog"
                    />
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </section>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
