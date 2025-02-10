// @ts-nocheck
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryCode, E164Number } from "libphonenumber-js";
import { useParams } from "react-router-dom";
import { validationSchema } from "./validation";
import { NumericFormat } from "react-number-format";
import { Link, useNavigate } from "react-router-dom";
import { getCurrency, getCurrencyName } from "../../utils/functions";

import usePost from "../../hooks/usePost";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  tickets: Array<any>;
  totalAmount: number;
  subTotal: number;
  totalbookingFee: number;
  vat: number;
  data: any;
};

interface ICheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  terms: boolean;
  userConsent: boolean;
  [key: string]: string | boolean;
}

interface IBoolean {
  [key: string]: boolean;
}

const CheckoutForm = (props: Props) => {
  const { tickets, data, totalAmount, subTotal, totalbookingFee, vat } = props;
  const defaultCountryCode = process.env.REACT_APP_COUNTRYCODE;
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT);
  const baseUrl = process.env.REACT_APP_BASEURL;
  const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_KEY;
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    userConsent: false,
    terms: false,
  };

  // console.log(tickets);
  const [formData, setFormData] = useState<ICheckoutForm>(initialValues);
  const [errors, setErrors] = useState<ICheckoutForm>(initialValues);
  const [touched, setTouched] = useState<IBoolean>({
    firstName: false,
    lastName: false,
    email: false,
    phoneNo: false,
    terms: false,
  });
  const [disabled, setDisabled] = useState(true);
  const [discount, setDiscount] = useState("");
  const [ticketDatas, setTicketDatas] = useState("");
  const { firstName, lastName, email, phoneNo, userConsent, terms } = formData;
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate();

  const onToken = (token: any) => {
    // console.log(token);
    setStripeToken(token);
  };
  const currency = data && getCurrency(data);
  const currencyName = data && getCurrencyName(data);
  const query = new URLSearchParams(window.location.search);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const customId = "toastid";

    if (query.get("success")) {
      toast.success("Order placed! You will receive an email confirmation.", {
        toastId: customId,
      });
    }

    if (query.get("canceled")) {
      toast.error(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [query]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]:
        e.target.name === "terms" || e.target.name === "userConsent"
          ? e.target.checked
          : e.target.value,
    }));
  };

  const handleChange = (value: E164Number) => {
    setFormData((prevState) => ({
      ...prevState,
      phoneNo: value,
    }));
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const onBlur = () => {
    validate();
  };

  useEffect(() => {
    validate();
  }, [formData]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      const payload = {
        email,
        amount: totalAmount * 100, // Convert to kobo (Paystack accepts in kobo)
        currency: currencyName,
      };

      const response = await axios.post(
        `${baseUrl}/paystack/initialise_transaction`,
        payload
      );

      // Redirect user to Paystack payment page
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const validate = () => {
    validationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setErrors(initialValues);
      })
      .catch((err: any) => {
        const errs: ICheckoutForm = initialValues;
        err.inner.forEach((error: any) => {
          if (touched[error.path]) errs[error.path] = error.message;
        });
        setErrors(errs);
      });

    validationSchema.isValid(formData).then((valid) => setDisabled(!valid));
  };

  const onDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDiscount(e.target.value);
  };

  const onDiscountClick = () => {};

  return tickets ? (
    <div className="mx-auto max-w-2xl bg-gray-200 px-4 pb-24 pt-32 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="xl:gap-x-16 lg:gap-x-12 lg:grid-cols-2 grid max-w-[1200px]">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-800">
              Checkout
            </h2>
          </div>
          <div className="mt-10">
            <h2 className="font-medium text-gray-800 text-lg">
              Ticket information
            </h2>

            <form onSubmit={onSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-2 mt-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-800"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <small className="form-error">
                    {touched?.firstName && errors?.firstName}
                  </small>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-800"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <small className="form-error">
                    {touched?.lastName && errors?.lastName}
                  </small>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-800"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <small className="form-error">
                    {touched?.email && errors?.email}
                  </small>
                </div>
                <div>
                  <label
                    htmlFor="phoneNo"
                    className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-800"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry={defaultCountryCode as CountryCode}
                    name="phoneNo"
                    autoComplete="off"
                    id="phoneNo"
                    value={phoneNo}
                    onFocus={onFocus}
                    onChange={handleChange}
                    onBlur={onBlur}
                    className="inputClass"
                  />
                  <small className="form-error">
                    {touched?.phoneNo && errors?.phoneNo}
                  </small>
                </div>
              </div>

              <div className="flex mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={terms}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="w-4 h-4 text-red-600 bg-white border-gray-900 rounded focus:ring-red-600 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-medium text-gray-800 dark:text-gray-300"
                  >
                    I accept the <Link to="/terms">terms and conditions</Link>
                  </label>
                  <p className="form-error">
                    {touched?.terms && errors?.terms}
                  </p>
                </div>
              </div>

              <div className="flex mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="userConsent"
                    name="userConsent"
                    type="checkbox"
                    checked={userConsent}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="w-4 h-4 text-red-600 bg-white border-[#25aae1] rounded focus:ring-red-600 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor="userConsent"
                    className="font-medium text-gray-800 dark:text-gray-300"
                  >
                    Create account with above information.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={disabled}
                className={`${
                  disabled ? "disabled" : ""
                } flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700`}
              >
                Pay &nbsp;
                <NumericFormat
                  value={Number(totalAmount).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={`${currency}`}
                />
              </button>
              {/* </StripeCheckout> */}
            </form>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <h2 className="text-lg font-medium text-gray-800">Ticket summary</h2>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-6 sm:px-6"></div>

            <dl className="aby border-t border-gray-200 px-4 py-6 sm:px-6">
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
                <dt className="text-base text-customBlack">Subtotal</dt>
                <dd className="text-base font-medium text-customBlack">
                  <NumericFormat
                    value={Number(subTotal).toFixed(2)}
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
                    value={Number(totalbookingFee).toFixed(2)}
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
                    value={Number(vat).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={`${currency}`}
                  />
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-500 pt-6">
                <dt className="text-lg text-customBlack font-bold">Total</dt>
                <dd className="text-base font-bold text-customBlack">
                  <NumericFormat
                    value={Number(totalAmount).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={`${currency}`}
                  />
                </dd>
              </div>
            </dl>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              {/* <StripeCheckout
       name = "MoTickets"
       image = "https://moloyal.com/images/moticketsicon.png"
      //  billingAddress
      //  shippingAddress
      currency={currencycode}
      email={email}
       description={`Your total amount is ${currency}${totalAmount}`}
       amount={totalAmount*100}
       token={onToken}
      stripeKey={STRIPE_KEY}
      >  */}

              {/* <button
                type="submit"
                disabled={disabled}
                className={`${
                  disabled ? "disabled" : ""
                } flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-red-700`}
              >
                Pay &nbsp;
                <NumericFormat
                  value={Number(totalAmount).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={`${currency}`}
                />
              </button> */}

              {/* </StripeCheckout> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default CheckoutForm;
