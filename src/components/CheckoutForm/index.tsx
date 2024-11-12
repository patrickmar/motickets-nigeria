import React, { useState, ChangeEvent, FormEvent } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { getCurrency, getCurrencyCode } from "../../utils/functions";
import { E164Number } from "libphonenumber-js";
import { NumericFormat } from "react-number-format";

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

const CheckoutForm = (props: Props) => {
  const { tickets, data, totalAmount, subTotal, totalbookingFee, vat } = props;

  const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_KEY;
  const taxPercent = Number(process.env.REACT_APP_TAXPERCENT);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    userConsent: false,
    terms: false,
  };

  const [formData, setFormData] = useState<ICheckoutForm>(initialValues);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  const { firstName, lastName, email, phoneNo, terms } = formData;
  const currency = data && getCurrency(data);
  const currencycode = data && getCurrencyCode(data);

  const handlePhoneChange = (value: E164Number | undefined) => {
    setFormData((prevState) => ({
      ...prevState,
      phoneNo: value || "", // Set an empty string if value is undefined
    }));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const onSuccess = () => {
    try {
      // Your success logic here, e.g., navigate to a success page
      navigate("/success", {
        state: {
          tickets: tickets,
          data: { data, totalAmount, subTotal, totalbookingFee, vat },
        },
        replace: true,
      });
    } catch (error) {
      console.error("Error in onSuccess callback:", error);
      toast.error("An error occurred during payment success handling.");
    }
  };

  const onClose = () => {
    try {
      toast.error("Transaction was not completed, window closed.");
    } catch (error) {
      console.error("Error in onClose callback:", error);
    }
  };
  const paystackConfig = {
    email: email,
    amount: totalAmount * 100, // Paystack expects amount in kobo
    publicKey: PAYSTACK_KEY || "",
    onSuccess: () => {
      try {
        onSuccess();
      } catch (error) {
        console.error("Error during onSuccess:", error);
      }
    },
    onClose: () => {
      try {
        onClose();
      } catch (error) {
        console.error("Error during onClose:", error);
      }
    },
    currency: currencycode,
    reference: uuidv4(),
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terms) {
      toast.error("Please accept the terms and conditions");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="xl:gap-x-16 lg:gap-x-12 lg:grid-cols-2 grid max-w-[1200px]">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white dark:text-white">
              Checkout
            </h2>
          </div>
          <div className="mt-10">
            <form onSubmit={onSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-2 mt-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNo"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    value={phoneNo as string}
                    onChange={handlePhoneChange}
                    className="inputClass"
                  />
                </div>
              </div>
              <div className="flex mb-6">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={onChange}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-600 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="terms"
                  className="font-medium text-white ms-2 text-sm dark:text-gray-300"
                >
                  I accept the <Link to="/terms">terms and conditions</Link>
                </label>
              </div>
              <PaystackButton
                {...paystackConfig}
                className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Proceed to Payment
              </PaystackButton>
            </form>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <h2 className="text-lg font-medium text-white">Ticket summary</h2>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
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
                <dt className="text-base text-red-600">Subtotal</dt>
                <dd className="text-base font-medium text-red-600">
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

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-lg text-red-600 font-bold">Total</dt>
                <dd className="text-base font-bold text-red-600">
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
              <PaystackButton
                {...paystackConfig}
                className="text-white bg-blue-500  hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Proceed to Payment &nbsp;
                <NumericFormat
                  value={Number(totalAmount).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={`${currency}`}
                />{" "}
              </PaystackButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
