// import React from "react";
import { useLocation } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";
// import { useParams } from "react-router-dom";

type Props = {};

const Checkout = (props: Props) => {
  const location = useLocation();
  const tickets = location?.state?.tickets?.filter((i: any) => i.qty > 0) || [];
  const data = location?.state?.data || {};

  //console.log(data);
  //console.log(tickets);

  // Calculate the sum of the amounts
  const calculateTotalAmount = (prices: any) => {
    return prices.reduce(
      (sum: any, item: any) => sum + Number(item.price * item.qty || 0),
      0
    );
  };

  // Calculate the sum of BookingFee
  const calculateTotalBookingFee = (bookingfees: any) => {
    return bookingfees.reduce(
      (sum: any, item: any) => sum + Number(item.booking_fee || 0),
      0
    );
  };

  const subtotal = calculateTotalAmount(tickets);
  const totalbookingFee = calculateTotalBookingFee(tickets);
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT || 0);
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
