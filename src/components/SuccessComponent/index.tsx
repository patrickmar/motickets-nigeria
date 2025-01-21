// @ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import ContentWrapper from "../../components/ContentWrapper";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { getCurrency, getCurrencyCode } from "../../utils/functions";
import "./styles.scss";

const SuccessComponent = ({ tickets, ticketData, data }) => {
  const baseUrl = process.env.REACT_APP_BASEURL;
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT);
  const [tick, setTick] = useState(tickets);
  const [userData, setUserData] = useState(data);
  const [tickData, setTickData] = useState(ticketData);
  const [validatePay, setValidatePay] = useState(false);
  const [loading, setLoading] = useState(true);

  const currency = data && getCurrency(data.data);
  const navigate = useNavigate();

  const resetState = () => {
    setTick([]);
    setUserData({});
    setTickData([]);
  };

  const MakeRequest = async () => {
    try {
      setLoading(true); // Set loading state initially
      const res = await axios.post(`${baseUrl}/dispense/internationalticket`, {
        userdata: userData,
        ticketData: tickData,
        myCart: tick,
        paystackData: paystack,
      });
  
      if (res.data.error === false) {
        setValidatePay(true);
      } else {
        alert("Payment validation failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("An error occurred while processing your payment.");
    } finally {
      setLoading(false); // Always unset loading
      resetState();
    }
  };
  
  
  
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
