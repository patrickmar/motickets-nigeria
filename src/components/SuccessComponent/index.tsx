import { useEffect, useState } from "react";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrency } from "../../utils/functions";
import "./styles.scss";
import ContentWrapper from "../ContentWrapper";

// Define types
interface Ticket {
  qty: number;
  name: string;
  price: number;
}

interface PaystackData {
  email: string;
  amount: number;
  reference: string;
  // Add any other Paystack-specific properties here
}

interface PaymentData {
  subTotal: number;
  totalbookingFee: number;
  vat: number;
  totalAmount: number;
}

interface Props {
  tickets: Ticket[];
  data: PaymentData;
  ticketData: any; // Replace with more specific type if possible
  paystackData: PaystackData; // Add paystackData to the Props type
}

const SuccessComponent: React.FC<Props> = ({ tickets, ticketData, data }) => {
  const location = useLocation();
  const baseUrl = process.env.REACT_APP_BASEURL;
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT);
  const navigate = useNavigate();
  const paystack = location?.state?.paystackData;

  const currency = data && getCurrency(data);
  const [validatePay, setValidatePay] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("Paystack Data:", paystack); // Log to verify

  console.log("Location State:", location.state);

  const MakeRequest = async () => {
    // if (!paystack) {
    //   console.error("No payment data found.");
    //   return;
    // }

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/dispense/internationalticket`, {
        userdata: data,
        ticketData: ticketData,
        myCart: tickets,
        paystackData: paystack,
      });

      console.log("Ticket Response:", res);
      if (res.data.error === false) {
        setValidatePay(true);
      } else {
        alert("Payment validation failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("An error occurred while processing your payment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    MakeRequest();
  }, []);
  console.log(data);
  console.log(ticketData);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {!validatePay ? (
            <>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                The payment is invalid! Please contact admin.
              </span>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: 10,
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
              >
                Go to Homepage
              </button>
            </>
          ) : (
            <div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                The tickets have been purchased successfully.
              </span>
              <button
                onClick={() => navigate("/")}
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
              >
                Go to Homepage
              </button>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm md:w-[700px]">
                <div className="aby border-t border-gray-200 px-4 py-6 sm:px-6">
                  {tickets.map((item, i) => (
                    <div className="flex items-center justify-between" key={i}>
                      <dt className="text-base text-customBlack">{`${item?.qty} * ${item?.name}`}</dt>
                      <dd className="text-base font-medium text-customBlack">
                        <NumericFormat
                          value={Number(item.price * item.qty).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={`${currency}`}
                        />
                      </dd>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <dt className="text-base text-red-600">Subtotal</dt>
                    <dd className="text-base font-medium text-red-600">
                      <NumericFormat
                        value={Number(data.subTotal).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={`${currency}`}
                      />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-base text-customBlack">Booking Fee</dt>
                    <dd className="text-base font-medium text-customBlack">
                      <NumericFormat
                        value={Number(data.totalbookingFee).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={`${currency}`}
                      />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-base text-customBlack">
                      VAT
                      <span className="ml-2 rounded-lg bg-gray-200 px-2 py-1 text-xs tracking-wide text-gray-600">
                        {taxPercent}%
                      </span>
                    </dt>
                    <dd className="text-base font-medium text-customBlack">
                      <NumericFormat
                        value={Number(data.vat).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={`${currency}`}
                      />
                    </dd>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-lg text-red-600 font-bold">Total</dt>
                    <dd className="text-base font-bold text-red-600">
                      <NumericFormat
                        value={Number(data.totalAmount).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={`${currency}`}
                      />
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                Loading...do not refresh.
              </span>
              {[1, 2, 3, 4, 5, 6, 7].map((item, i) => (
                <div key={i} className="row skeleton"></div>
              ))}
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default SuccessComponent;
