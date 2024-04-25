// Your component file

import { errorTost, successTost } from "@/components/toast/allTost";
import { generateRandomId } from "@/app/api/Payment";
import addOrderProduct from "../order/add-order-product";
import { deleteCartItem } from "../cart-operation";

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
  userid: string
) => {
  if (cartData != undefined) {
    const orderItems = cartData.map((item) => ({
      name: item.attributes.product_name,
      sku: item.attributes.Product_id.toString(),
      units: item.attributes.qnt,
      selling_price: item.attributes.product_price,
      discount: discountAmount,
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
        for (const item of cartData) {
          try {
            const price = item.attributes.product_price;
            const productId = item.id;
            const qnt = item.attributes.qnt;
            const date = `${year}-${month}-${day}`;
            const name = item.attributes.product_name;
            const img = item.attributes.img;

            const res = await addOrderProduct(
              productId,
              orderId,
              qnt,
              price,
              img,
              date,
              name,
              userid
            );
          } catch (error) {
            console.log(error);
          }
        }
        successTost("Order placed successfully");

        for (const items of cartData) {
          try {
            const res = await deleteCartItem(items.id);
            console.log(`${items.id} deleted successfully`);
          } catch (error) {
            console.log(error);
          }
        }

        router.push("/orders");
      } else {
        console.log(response.text);
        errorTost("Something went wrong");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      errorTost("Something went wrong");
    }
  }
};

export default addOrder;
