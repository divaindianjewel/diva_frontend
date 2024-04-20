const addOrderProduct = async (
  product_id: number,
  order_id: number,
  qnt: number
) => {
  try {
    const response = await fetch("http://localhost:1337/api/ordered-products", {
      method: "POST",
      body: JSON.stringify({
        product_id: product_id,
        order_id: order_id,
        qnt: qnt,
      }),
    });

    if (response) {
      console.log("Item added successfully");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};