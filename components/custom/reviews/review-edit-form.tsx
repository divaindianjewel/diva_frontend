"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { successTost } from "../../toast/allTost";
import { IoIosStar } from "react-icons/io";

import { TiPencil } from "react-icons/ti";
import { EditReview } from "./reviewBox";
import { domain } from "../../backend/apiRouth";
import { Textarea } from "../../ui/textarea";

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

const EditReviewFormDialog: React.FC<{
  reviewId: number;
  random: () => void;
}> = ({ reviewId, random }) => {
  const starSize = 30;

  const [rating, setRating] = useState<number>(0);
  const [stars, setStars] = useState<string[]>(["", "", "", "", ""]);
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [reviewData, setReviewData] = useState<reviews>();

  const setStar = (index: number) => {
    const newStars = stars.map((_, i) => (i < index ? "gold" : ""));
    setStars(newStars);
    setRating(index);
  };

  useEffect(() => {
    const getReviewData = async () => {
      const response = await fetch(`${domain}/api/reviews/${reviewId}`);
      const data = await response.json();
      setReviewData(data.data);
      setStar(data.data.attributes.ratting);
      setDescription(data.data.attributes.Description);
    };
    getReviewData();
  }, [reviewId]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <div className="edit bg-yellow-500 p-[0.5rem] rounded-lg mt-[9px]">
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
            {/* {isOpen && (
              <DialogClose
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
              />
            )}{" "} */}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditReviewFormDialog;
