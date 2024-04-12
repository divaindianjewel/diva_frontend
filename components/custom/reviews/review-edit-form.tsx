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
import { successTost, errorTost } from "@/components/toast/allTost";
import { IoIosStar } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";

// clerk
import { TiPencil } from "react-icons/ti";

import { auth, useAuth, useUser } from "@clerk/nextjs";
import {} from "@clerk/nextjs";
import { EditReview } from "@/components/custom/reviews/reviewBox";

const EditReviewFormDialog: React.FC<{
  reviewId: number;
  random: () => void;
}> = ({ reviewId, random }) => {
  const starSize = 30;

  const [rating, setRating] = useState<number>(0);
  const [stars, setStars] = useState<string[]>(["", "", "", "", ""]);
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId, sessionId, getToken } = useAuth();

  const setStar = (index: number) => {
    const newStars = stars.map((_, i) => (i < index ? "gold" : ""));
    setStars(newStars);
    setRating(index);
  };

  const submitHandler = async (e: React.FormEvent) => {
    await EditReview(rating, description, reviewId)
      .then(() => {
        setIsOpen(false);
        successTost("your Edited added successfully");
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });

    random();
  };

  return (
    <section>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <div className="edit bg-yellow-500 p-[0.5rem]">
            <TiPencil color="white" size={25} />
          </div>
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
                    Edit Review
                  </button>
                </div>
              </form>
            </DialogDescription>
            {isOpen && (
              <DialogClose
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
              />
            )}{" "}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditReviewFormDialog;
