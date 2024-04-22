import { domain } from "@/components/backend/apiRouth";

const addOrderProduct = async (
  product_id: number,
  order_id: number,
  qnt: number,
  price: number,
  img: string,
  date: string,
  name : string
) => {
  try {
    const response = await fetch(
      `${domain}/api/ordered-products`,
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
            price: price,
            image: img,
            date : date,
            name : name
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
