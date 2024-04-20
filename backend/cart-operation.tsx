import { domain } from "@/components/backend/apiRouth";
import axios from "axios";

export const incrementQnt = async (cart_id: number, qnt: number) => {
  let newQnt = qnt + 1;
  console.log("i am running");
  try {
    const res = await axios.put(`${domain}/api/carts/${cart_id}`, {
      data: { qnt: newQnt },
    });

    console.log("Cart updated", res.data.data.attributes.qnt);
    return res.data.data.attributes.qnt;
  } catch (error) {
    console.log(error);
  }
};

export const decrementQnt = async (cart_id: number, qnt: number) => {
  let newQnt = qnt - 1;
  try {
    const res = await axios.put(`${domain}/api/carts/${cart_id}`, {
      data: { qnt: newQnt },
    });

    console.log("Cart updated", res.data.data.attributes.qnt);
    return res.data.data.attributes.qnt;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCartItem = async (cart_id: number) => {
  try {
    const response = await fetch(`${domain}/api/carts/${cart_id}`, {
      method: "DELETE",
    });
    if (response) {
      console.log("Product Deleted Successfully");
    }
  } catch (error) {
    console.log("something went wrong");
    console.log("ERROR : " + error);
  }
};