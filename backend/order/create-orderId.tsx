import { useUser } from "@clerk/clerk-react";

export const addOrder = async (price: number, discount: number) => {
  const { user } = useUser();

  const user_id = user?.id;
  const user_name = user?.firstName;

  const currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1; // Note: January is 0
  var year = currentDate.getFullYear();

  const response = await fetch(`http://localhost:1337/api/orders`, {
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
};
