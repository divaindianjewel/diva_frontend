import Navbar from "@/components/custom/navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="container py-8">
        <h1 className="text-center text-3xl capitalize py-6 font-semibold underline">
          Diva do Shipping by shiprocket
        </h1>
        <p>
          WE OFFER FREE SHIPPING ANYWHERE IN INDIA Please allow 1-3 working days
          for your order to be dispatched. Normally orders placed before 1pm on
          a business day, we aim to ship the same day, providing card security
          checks are complete, payment received and stock availability is
          confirmed. Orders placed after 1pm will be shipped the next business
          day. Orders Received on Sunday or during Holidays are dispatched the
          following Monday or next working day. During busy times, such as
          holiday periods, there can be processing and shipping delays. The
          orders cannot be shipped to PO boxes or military addresses, rural
          domestic addresses require one or more additional days to deliver.
          Orders requiring engraving or any customization will require
          additional time and will be shipped in 10 working days.
        </p>
      </div>
    </>
  );
};

export default page;
