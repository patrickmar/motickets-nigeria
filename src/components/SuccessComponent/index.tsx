// @ts-nocheck
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { CountryCode, E164Number } from 'libphonenumber-js';
import ContentWrapper from '../../components/ContentWrapper';

import { NumericFormat } from 'react-number-format';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrency, getCurrencyCode } from '../../utils/functions';
import StripeCheckout from 'react-stripe-checkout';
import usePost from '../../hooks/usePost';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  tickets: Array<any>;
  ticketData: Array<any>;
  data: any;
  stripeData: any;
};

interface ICheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;

  userConsent: boolean;
  [key: string]: string | boolean;
}

interface IBoolean {
  [key: string]: boolean;
}

const SuccessComponent = (props: Props) => {
 
  const { ticketData, stripeData, tickets, data } = props;
  const defaultCountryCode = process.env.REACT_APP_COUNTRYCODE;
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT);
  const baseUrl = process.env.REACT_APP_BASEURL;
console.log(data);
  const [tick, setTick] = useState(tickets);
  const [stripe, setStripe] = useState(stripeData);
  const [userData, setUserData] = useState(data);
  const [tickData, setTickData] = useState(ticketData);
  const [validatePay, setValidatePay] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const currency = data && getCurrency(data.data);
  const navigate = useNavigate();

  const currencycode = data && getCurrencyCode(data);
  // const location = useLocation();
  // //in Cart.jsx I sent data and cart. Please check that page for the changes.(in video it's only data)
  // const data = location.state.stripeData;
  // const cart = location.state.cart;
  // const currentUser = useSelector((state) => state.user.currentUser);
  // const [orderId, setOrderId] = useState(null);

  // useEffect(() => {
  //   const createOrder = async () => {
  //     try {
  //       const res = await userRequest.post("/orders", {
  //         userId: currentUser._id,
  //         products: cart.products.map((item) => ({
  //           productId: item._id,
  //           quantity: item._quantity,
  //         })),
  //         amount: cart.total,
  //         address: data.billing_details.address,
  //       });
  //       setOrderId(res.data._id);
  //     } catch {}
  //   };
  //   data && createOrder();
  // }, [cart, data, currentUser]);
  //

  //  const { data, loading } =  usePost(`/dispense/ticket`, {
  //             tickets : tickets,
  //             userdata: data,
  //             currency: currencycode
  //        });

  // const { tickdata, loading } =  usePost(`/dispense/ticket`, {
  //   tickets : tickets,
  //   userdata: data,
  //   currency: currencycode
  // });

  

  const resetState = () => {
    setTick({});
    setStripe({});
    setUserData({});
    setTickData({});
   
  };

  useEffect(() => {
  
    const MakeRequest = async () => {

      
      try {
        // console.log(userData);
        // console.log(stripe);
        //  console.log(tickData);
        //  console.log(tick);
        const res = await axios
          .post(`${baseUrl}/dispense/internationalticket`, {
            
            userdata: userData,
            stripeData: stripe,
            ticketData: tickData,
            myCart: tick,
          })
          .then((res: any) => {

            
            // setLoading(false);
            // setData(res?.name === "AxiosError" ? null : res);
            setTimeout(() => {
              setLoading(false);
              resetState();
             
                if (res.data.error === false) {
       
        setValidatePay(true);
           
        }
              //setData(res?.name === "AxiosError" ? null : res);
            }, 5000 * 1);
          });

        //toast(res.data.error);
      
       
      } catch (error) {
        console.log(error);
      }
    };

     MakeRequest();
  }, []);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <div
          style={{
            height: '100vh',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {!validatePay
            ? (  
              <>
              <span  style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>The payment is invalid! Please contact admin.</span>
            <button
              onClick={() => navigate('/')}
              style={{ padding: 10, marginTop: 20, alignItems: 'center',
              justifyContent: 'center',
              color: 'white', }}
              className='flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700'>
              
              Go to Homepage
            </button>
            </>
            )
            : (   
            
            <div>
               <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>The tickets have been purchased successfully.</span>
          <button
            onClick={() => navigate('/')}
            style={{  marginTop: 20, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            color: 'white', }}
          className='flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700'>
            Go to Homepage
          </button>
          <div
            // style={{ width: '700px' }}
            className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm md:w-[700px]"
          >
            <div className="aby border-t border-gray-200 px-4 py-6 sm:px-6">
              {tickets.map((item, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <dt className="text-base text-customBlack">{`${item?.qty} * ${item?.name}`}</dt>
                  <dd className="text-base font-medium text-customBlack">
                    <NumericFormat
                      value={Number(item.price * item.qty).toFixed(2)}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={`${currency}`}
                    />
                  </dd>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <dt className="text-base text-red-600 ">Subtotal</dt>
                <dd className="text-base font-medium text-red-600">
                  <NumericFormat
                    value={Number(data.subTotal).toFixed(2)}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={`${currency}`}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-base text-customBlack">
                  Booking Fee
                  
                </dt>
                <dd className="text-base font-medium text-customBlack">
                  <NumericFormat
                    value={Number(data.totalbookingFee).toFixed(2)}
                    displayType={'text'}
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
                    displayType={'text'}
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
                    displayType={'text'}
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
            <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>Loading...do not refresh.<br></br></span>
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