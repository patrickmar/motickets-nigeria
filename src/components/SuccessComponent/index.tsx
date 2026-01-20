import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrency } from "../../utils/functions";
import "./styles.scss";
import ContentWrapper from "../ContentWrapper";
import { toast } from "react-toastify";

interface Ticket {
  qty: number;
  name: string;
  price: number;
}

interface Props {
  tickets: Array<any>;
  formData: Array<any>;
  totalAmount: number;
  subTotal: number;
  totalbookingFee: number;
  vat: number;
  data: any;
  reference: number;
  payValidated: any;
}

const paystackKey = process.env.REACT_APP_PAYSTACK_KEY;

const SuccessComponent = (props: Props) => {
  const {
    tickets,
    data,
    totalAmount,
    subTotal,
    totalbookingFee,
    vat,
    reference,
    formData,
    payValidated,
  } = props;

  const location = useLocation();
  const baseUrl = process.env.REACT_APP_BASEURL;
  const navigate = useNavigate();
  const currency = getCurrency(data);

  const [tick, setTick] = useState(tickets);
  const [validatePay, setValidatePay] = useState(payValidated);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [payres, setPayres] = useState<any>({});

  // Prepare merged data for dispense
  const newJson = {
    vat: vat,
    totalbookingFee: totalbookingFee,
    subTotal: subTotal,
    totalAmount: totalAmount,
  };
  const mergedData = { ...data, ...formData, ...newJson };

  const verifyPayment = useCallback(async () => {
    if (!reference) {
      toast.error("No payment reference found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/paystack/verify_transaction/${reference}`,
      );

      const paystackData = response.data.paystackresp;

      if (
        paystackData.status === true &&
        paystackData.data.status === "success"
      ) {
        setPayres(paystackData.data);

        // Dispense tickets
        try {
          const dispenseResponse = await axios.post(
            `${baseUrl}/dispense/paystack_ticket`,
            {
              userdata: mergedData,
              myCart: tick,
              paystackData: paystackData.data,
            },
          );

          if (dispenseResponse.data.error === false) {
            setValidatePay(true);
            toast.success("Payment successful! Tickets have been issued.");
          } else {
            toast.error("Ticket dispensing failed. Please contact support.");
            console.error("Dispense error:", dispenseResponse.data);
          }
        } catch (dispenseError) {
          console.error("Ticket dispensing error:", dispenseError);
          toast.error("Error processing tickets. Contact support.");
        }
      } else {
        toast.error(
          "Payment verification failed or payment was not successful.",
        );
        setValidatePay(false);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("An error occurred during payment verification.");
      setValidatePay(false);
    } finally {
      setLoading(false);
    }
  }, [reference, baseUrl, mergedData, tick]);

  useEffect(() => {
    // Only verify payment if not already validated
    if (!validatePay && reference) {
      verifyPayment();
    } else if (!reference) {
      setLoading(false);
      setValidatePay(false);
    }
  }, [validatePay, reference, verifyPayment]);

  const resetState = () => {
    setTick([]);
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <div className="flex flex-col items-center justify-center h-screen text-white">
          {!validatePay ? (
            <>
              <span className="text-black">
                The payment is invalid or could not be verified! Please contact
                admin.
              </span>
              <br />
              <button
                onClick={() => navigate("/")}
                className="mt-5 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
              >
                Go to Homepage
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-black text-xl font-bold mb-4">
                Payment Successful! Tickets have been purchased.
              </span>
              <button
                onClick={() => navigate("/")}
                className="mt-5 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
              >
                Go to Homepage
              </button>
              <div className="mt-8 p-6 rounded-lg border bg-white shadow-md md:w-[700px]">
                <h3 className="text-xl font-bold text-black mb-4">
                  Ticket Details
                </h3>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  {tickets.map((item, i) => (
                    <div className="flex justify-between mb-2" key={i}>
                      <dt className="text-base text-customBlack">{`${item.qty} × ${item.name}`}</dt>
                      <dd className="text-base font-medium text-customBlack">
                        <NumericFormat
                          value={Number(item.price * item.qty).toFixed(2)}
                          displayType="text"
                          thousandSeparator
                          prefix={currency}
                        />
                      </dd>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <dt className="text-base text-red-600">Subtotal</dt>
                    <dd className="text-base font-medium text-red-600">
                      <NumericFormat
                        value={Number(subTotal).toFixed(2)}
                        displayType="text"
                        thousandSeparator
                        prefix={currency}
                      />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base text-customBlack">Booking Fee</dt>
                    <dd className="text-base font-medium text-customBlack">
                      <NumericFormat
                        value={Number(totalbookingFee).toFixed(2)}
                        displayType="text"
                        thousandSeparator
                        prefix={currency}
                      />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base text-customBlack">
                      VAT{" "}
                      <span className="ml-2 bg-gray-200 px-2 py-1 text-xs text-gray-600">
                        {process.env.REACT_APP_TAXPERCENT}%
                      </span>
                    </dt>
                    <dd className="text-base font-medium text-customBlack">
                      <NumericFormat
                        value={Number(vat).toFixed(2)}
                        displayType="text"
                        thousandSeparator
                        prefix={currency}
                      />
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-6 mt-4">
                    <dt className="text-lg font-bold text-red-600">Total</dt>
                    <dd className="text-lg font-bold text-red-600">
                      <NumericFormat
                        value={Number(totalAmount).toFixed(2)}
                        displayType="text"
                        thousandSeparator
                        prefix={currency}
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
              <span className="flex items-center justify-center text-white">
                Verifying payment... Please wait.
              </span>
              {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
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
