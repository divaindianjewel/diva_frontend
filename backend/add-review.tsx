import axios from "axios";

export const addReview = async (
  productId: number,
  rating: number,
  description: string,
  userId: string,
  userName: string
) => {
  try {
    const response = await axios.post("http://localhost:1337/api/reviews", {
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
