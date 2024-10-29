// import React from "react";
import { useLocation } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";
// import { useParams } from "react-router-dom";

type Props = {};

const Checkout = (props: Props) => {
  const location = useLocation();
  const tickets = location?.state?.tickets.filter((i: any) => i.qty > 0);
  const data = location?.state?.data;

  // Calculate the sum of the amounts
  const calculateTotalAmount = (prices: any) => {
    const price = prices?.reduce(
      (sum: any, item: any) => Number(sum) + Number(item.price * item.qty || 0),
      0
    );
    return price;
  };

  // Calculate the sum of BookingFee
  const calculateTotalBookingFee = (bookingfees: any) => {
    const bookingfee = bookingfees?.reduce(
      (sum: any, item: any) => Number(sum) + Number(item.booking_fee || 0),
      0
    );
    return bookingfee;
  };

  console.log();
  const subtotal = calculateTotalAmount(tickets);
  const totalbookingFee = calculateTotalBookingFee(tickets);
  console.log(totalbookingFee);
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT);
  const vat = (taxPercent / 100) * subtotal;
  const totalAmount = subtotal + totalbookingFee + vat;

  return (
    <CheckoutForm
      tickets={tickets}
      data={data}
      totalbookingFee={totalbookingFee}
      vat={vat}
      totalAmount={totalAmount}
      subTotal={subtotal}
    />
  );
};

export default Checkout;
