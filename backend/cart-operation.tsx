import { domain } from "@/components/backend/apiRouth";
import axios from "axios";

export const incrementQnt = async (cart_id: number, qnt: number) => {
  let newQnt = qnt + 1;
  try {
    const res = await axios.put(`${domain}/api/carts/${cart_id}`, {
      data: { qnt: newQnt },
    });
    
    console.log("Cart updated", res.data);

  } catch (error) {
    console.log(error);
  }
};
