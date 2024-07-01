// Your component file

import { errorTost, successTost } from "../../components/toast/allTost";

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

const addOrder = async (
  obj: any,
  router: any,
  cartData: CartItem[] | any[] | undefined,
  total: number,
  orderId: number,
  discountAmount: number,
  orderMethod: string
) => {
  if (cartData != undefined) {
    console.log(cartData);
    const orderItems = cartData.map((item) => ({
      name: item.name,
      sku: item.id.toString(),
      units: item.qnt,
      selling_price: item.price,
      discount: discountAmount,
      tax: "3",
      hsn: 441122,
    }));

    const currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // Note: January is 0
    var year = currentDate.getFullYear();

    const payload = {
      order_id: `OR-${orderId}`,
      order_date: `${year}-${month}-${day}`,
      pickup_location: "Primary",
      channel_id: "4854844",
      comment: "Reseller: M/s Varma",
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
      shipping_pincode: obj.pincode,
      shipping_country: "india",
      shipping_state: obj.state,
      shipping_email: obj.email,
      shipping_phone: obj.phone_number,
      order_items: orderItems,
      payment_method: "Online",
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: discountAmount,
      sub_total: total,
      length: 10,
      breadth: 15,
      height: 20,
      weight: 2.5,
    };
    try {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        successTost("Order placed successfully");
        router.push("/orders");
      } else {
        console.log(response.text);
        errorTost("Something went wrong");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      errorTost("Something went wrong while Ordering");
    }
  }
};

export default addOrder;
