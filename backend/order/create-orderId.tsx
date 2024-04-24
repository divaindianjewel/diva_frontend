import { domain } from "@/components/backend/apiRouth";
import { useUser } from "@clerk/clerk-react";

const CreateOrderId = async (
  price: number,
  discount: number,
  user_id: string | null | undefined,
  user_name: string | null | undefined
) => {
  const currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1; // Note: January is 0
  var year = currentDate.getFullYear();

  if (
    user_id != null &&
    user_id != undefined &&
    user_name != null &&
    user_name != undefined
  ) {
    try {
      const response = await fetch(`${domain}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: {
            user_id: user_id,
            order_date: `${day}-${month}-${year}`,
            total_price: price,
            discount: discount,
            user_name: user_name,
          },
        }),
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
};

export default CreateOrderId;
