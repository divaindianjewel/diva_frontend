import { errorTost, successTost } from "@/components/toast/allTost";
import { generateRandomId } from "@/app/api/Payment";
import { useRouter } from "next/router";

interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
    img: any;
  };
}

const addOrder = async (obj: any, router: any, cartData: CartItem[]) => {
  const orderItems = cartData.map((item) => ({
    name: item.attributes.product_name,
    sku: item.attributes.Product_id.toString(),
    units: item.attributes.qnt,
    selling_price: item.attributes.product_price,
    discount: "0",
    tax: "3",
    hsn: 441122,
  }));

  const currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1; // Note: January is 0
  var year = currentDate.getFullYear();

  const payload = {
    order_id: `OR-${generateRandomId(10)}`,
    order_date: `${year}-${month}-${day}`,
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
    order_items: orderItems,
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
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.NEXT_PUBLIC_SHIPROCKET_ID,
  };

  const shiprocketResponse = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    }
  );

  if (shiprocketResponse.ok) {
    successTost("Order shipped successfully");
    router.push("/");
  } else {
    errorTost("Something went wrong");
  }
};

export default addOrder;
