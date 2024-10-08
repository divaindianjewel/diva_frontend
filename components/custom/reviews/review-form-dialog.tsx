"use client";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  successTost,
  errorTost,
  warningTost,
} from "@/components/toast/allTost";
import { IoIosStar } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";
import { addReview } from "@/components/custom/reviews/reviewBox";

// clerk
import { auth, useAuth, useUser } from "@clerk/nextjs";
import {} from "@clerk/nextjs";
import { domain } from "@/components/backend/apiRouth";
import Cookies from "js-cookie";

interface reviews {
  id: number;
  attributes: {
    product_id: number;
    ratting: number;
    Description: string;
    user_id: string;
    user_name: string;
  };
}

const ReviewFormDialog: React.FC<{
  productId: number;
  random: () => void;
  randomNum: number;
}> = ({ productId, random, randomNum }) => {
  const starSize = 30;

  const [rating, setRating] = useState<number>(0);
  const [stars, setStars] = useState<string[]>(["", "", "", "", ""]);
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [reviewAdded, setReviewAdded] = useState<boolean>(true);
  const [userLocalId, setUserLocalId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const setStar = (index: number) => {
    const newStars = stars.map((_, i) => (i < index ? "gold" : ""));
    setStars(newStars);
    setRating(index);
  };

  useEffect(() => {
    const cookie = Cookies.get("DIVAIJ-USER");

    const data = cookie ? cookie : "null";
    setUserLocalId(data);

    setLoading(false);
  }, [loading]);

  useEffect(() => {
    const getReviewData = async () => {
      const response = await fetch(
        `${domain}/api/reviews?filters[$and][0][user_id][$eq]=${userLocalId}&filters[$and][1][product_id][$eq]=${productId}`
      );

      const data = await response.json();

      if (data.data.length != 0) {
        setReviewAdded(false);
      }
    };

    getReviewData();
  }, [randomNum, userLocalId]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userLocalId !== "null") {
      if (reviewAdded) {
        let userName = "User";
        await addReview(productId, rating, description, userLocalId)
          .then(() => {
            setIsOpen(false);
            successTost("your review added successfully");
          })
          .catch((error) => {
            console.error("Error submitting review:", error);
          });

        setRating(0);
        setDescription("");

        random();
      } else {
        warningTost("Your review is already added");
      }
    } else {
      e.preventDefault();
      errorTost("Please Login first");
    }
  };

  return (
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
              <form onSubmit={submitHandler}>
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
  );
};

export default ReviewFormDialog;
