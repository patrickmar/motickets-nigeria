import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrency } from "../../utils/functions";
import "./styles.scss";
import ContentWrapper from "../ContentWrapper";
import { toast } from "react-toastify";
import { object } from "yup";

interface Ticket {
  qty: number;
  name: string;
  price: number;
}

interface PaystackData {
  email: string;
  amount: number;
  reference: string;
}

// interface PaymentData {
//   subTotal: number;
//   totalbookingFee: number;
//   vat: number;
//   totalAmount: number;
// }

interface Props {
  tickets: Array<any>;
  formData: Array<any>;
  
 
  totalAmount: number;
   subTotal: number;
  totalbookingFee: number;
  vat: number;
  data: any;
  reference: number;
}

const paystackKey = process.env.REACT_APP_PAYSTACK_KEY;



const SuccessComponent = (props: Props) => {
  const { tickets, data, totalAmount, subTotal, totalbookingFee, vat, reference, formData } = props;
 
  const location = useLocation();
  const baseUrl = process.env.REACT_APP_BASEURL;
  const navigate = useNavigate();
  const currency = getCurrency(data);
  
  const [validatePay, setValidatePay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payres, setPayres] = useState({});

  // const query = new URLSearchParams(window.location.search);
  // const reference = query.get("reference");

 // const reference = new URLSearchParams(location.search).get("reference");
const newJson={
 vat: vat,
        totalbookingFee:totalbookingFee,
        subTotal:subTotal,
        totalAmount: totalAmount 
      
      }
 const mergedData={...data, ...formData,...newJson};
 
 console.log("userdata ", mergedData);
 console.log("ticket ", tickets);
 console.log("ref ", reference);
 
  useEffect(() => {

    
  
    const verifyPayment = async () => {
      try {
        await axios.get(
          `${baseUrl}/paystack/verify_transaction/${reference}`,
          
        ).then(res => {
          let status= res.data.paystackresp.status;
          console.log(status);
          if ( status === true) {
            setPayres(res.data);

         try{
            toast.success("Payment successful!");
           
              axios.post(`${baseUrl}/dispense/paystack_ticket`, {
              userdata: mergedData,
              
              myCart: tickets,
              paystackData: res.data.paystackresp.data,
            }).then(resDispense => {
              console.log("Ticket Response:", resDispense);
              if (resDispense.data.error === false) {
                      setValidatePay(true);
                    } else {
                      console.log("Ticket dispensing failed. Please contact support.");
                    }
            
            });
      
            
          
            // if (resDispense.data.error === false) {
            //   setValidatePay(true);
            // } else {
            //   console.log("Ticket dispensing failed. Please contact support.");
            // }
          } catch (error) {
            console.error("Ticket processing error:", error);
          } finally {
            setLoading(false);
          }
        
          // dispenseTickets(); // Call ticket dispensing function
  
           // navigate("/success");
          } else {
             toast.error("Payment verification failed.");
            // navigate("/checkout");
          }
          }).catch(error => {
         console.log(error);
          });
        console.log(reference);
        
       
       
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("An error occurred during payment verification.");
       // navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    
    verifyPayment();
  }, []);
  console.log(payres);
  // const dispenseTickets = async () => {
  //   try {
  //     //console.log("ticketData ", ticketData);
  //     console.log("userdata ", mergedData);
  //     console.log("ticket ", tickets);
  //     console.log(payres);
     // console.log(ticketData);
  //     const res = await axios.post(`${baseUrl}/dispense/paystack_ticket`, {
  //       userdata: mergedData,
        
  //       myCart: tickets,
  //       paystackData: payres,
  //     });

  //     console.log("Ticket Response:", res);

  //     if (res.data.error === false) {
  //       setValidatePay(true);
  //     } else {
  //       console.log("Ticket dispensing failed. Please contact support.");
  //     }
  //   } catch (error) {
  //     console.error("Ticket processing error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   verifyPayment();
  // }, [verifyPayment]);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <div className="flex flex-col items-center justify-center h-screen text-white">
          {!validatePay ? (
            <>
              <span className="text-black">
                The payment is invalid! Please contact admin.
              </span>
              <button
                onClick={() => navigate("/")}
                className="mt-5 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
              >
                Go to Homepage
              </button>
            </>
          ) : (
            <div>
              <span className="text-black">
                The tickets have been purchased successfully.
              </span>
              <button
                onClick={() => navigate("/")}
                className="mt-5 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
              >
                Go to Homepage
              </button>
              <div className="mt-4 p-4 rounded-lg border bg-white shadow-md md:w-[700px]">
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  {tickets.map((item, i) => (
                    <div className="flex justify-between" key={i}>
                      <dt className="text-base text-customBlack">{`${item.qty} * ${item.name}`}</dt>
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
                  <div className="flex justify-between">
                    <dt className="text-base text-red-600">Subtotal</dt>
                    <dd className="text-base font-medium text-red-600">
                      <NumericFormat
                        value={Number(data.subTotal).toFixed(2)}
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
                        value={Number(data.totalbookingFee).toFixed(2)}
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
                        value={Number(data.vat).toFixed(2)}
                        displayType="text"
                        thousandSeparator
                        prefix={currency}
                      />
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-6">
                    <dt className="text-lg font-bold text-red-600">Total</dt>
                    <dd className="text-lg font-bold text-red-600">
                      <NumericFormat
                        value={Number(data.totalAmount).toFixed(2)}
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
                Loading... do not refresh.
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
