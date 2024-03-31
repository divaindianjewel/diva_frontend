import { errorTost, successTost } from "@/components/toast/allTost";
import { generateRandomId } from "../phonepe/pay-method";
import { useRouter } from "next/navigation";

export const addOrder = async (obj: any, router: any) => {
  // Pass the router object as an argument
  const shiprocketResponse = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_SHIPROCKET_ID,
      },

      body: JSON.stringify({
        order_id: `OR-${generateRandomId(10)}`,
        order_date: "2024-03-27 11:11",
        pickup_location: "Primary",
        channel_id: "4854844",
        comment: "Reseller: M/s Goku",
        billing_customer_name: obj.first_name,
        billing_last_name: obj.last_name,
        billing_address: obj.address,
        billing_address_2: obj.address,
        billing_city: obj.city,
        billing_pincode: String(obj.pincode),
        billing_state: obj.state,
        billing_country: "India",
        billing_email: obj.email,
        billing_phone: String(obj.phone_number),
        shipping_is_billing: true,
        shipping_customer_name: obj.first_name,
        shipping_last_name: obj.last_name,
        shipping_address: obj.address,
        shipping_address_2: obj.address,
        shipping_city: obj.city,
        shipping_pincode: String(obj.pincode),
        shipping_country: "india",
        shipping_state: obj.state,
        shipping_email: obj.email,
        shipping_phone: String(obj.phone_number),
        order_items: [
          {
            name: "Kunai",
            sku: "chakra123",
            units: 10,
            selling_price: "900",
            discount: "",
            tax: "",
            hsn: 441122,
          },
        ],
        payment_method: "Online",
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: 9000,
        length: 10,
        breadth: 15,
        height: 20,
        weight: 2.5,
      }),
    }
  );

  if (shiprocketResponse.ok) {
    successTost("Order shipped successfully");
    router.push("/");
  } else {
    errorTost("something went wrong");
  }
};

export default addOrder;
