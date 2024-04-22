import { domain } from "@/components/backend/apiRouth";

const addOrderProduct = async (
  product_id: number,
  order_id: number,
  qnt: number
) => {
  try {
    const response = await fetch(
      `https://diva-backend-iukkr.ondigitalocean.app/api/ordered-products`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: {
            productId: product_id,
            orderId: order_id,
            qnt: qnt,
          },
        }),
      }
    );

    if (response) {
      console.log("Item added successfully");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return 0;
  }
};

export default addOrderProduct;
