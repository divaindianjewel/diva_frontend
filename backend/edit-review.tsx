import { domain } from "@/components/backend/apiRouth";
import axios from "axios";

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
