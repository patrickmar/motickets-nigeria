import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo/motickets_logo.png";
// import { MdArrowDropDown } from "react-icons/md";
// import { useCountries, Country } from "../../../constant/useCountries";
// import ReCAPTCHA from "react-google-recaptcha";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../redux/api/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { countries } from "countries-list";

type Props = {};

// type ICountry = {
//   name: string;
//   native: string;
//   phone: string;
//   continent: string;
//   capital: string;
//   currency: string;
//   languages: string[];
//   emoji: string;
//   emojiU: string;
// };

// type Country = {
//   name: string;
//   native: string;
//   phone: string;
//   continent: string;
//   capital: string;
//   currency: string;
//   languages: string[];
//   emoji: string;
//   emojiU: string;
// };

// Define the structure of the imported countries object
// type Countries = {
//   [code: string]: Country;
// };

// Define the expected type for the login response
// interface LoginResponse {
//   email: string;
//   image: string | null;
//   submerchantId: string | null;
//   fullname: string;
//   lastname: string | null;
//   agentId: string | null;
//   branchId: string;
//   accountNo: string;
//   city: string;
//   state: string;
//   accountName: string;
//   dateOfBirth: string;
//   gender: string;
//   bank: string;
//   bankcode: string;
//   bvn: string;
//   message: string;
// }

// Define the expected type for the error response
interface LoginError {
  error: boolean;
  message: string;
}

const Register = (props: Props) => {
  // Move the United Kingdom to the first position
  const countriesList = Object.values(countries);
  const ngIndex = countriesList.findIndex(
    (country) => country.name === "Nigeria"
  );
  if (ngIndex !== -1) {
    const [ngCountry] = countriesList.splice(ngIndex, 1);
    countriesList.unshift(ngCountry);
  }

  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    country: "Nigeria", // Set the default country to United Kingdom
    password: "",
  });
  const { fullname, email, country, password } = user;
  const [register, { isLoading, error, data }] = useRegisterMutation();

  console.log(data);

  const [showDropdown, setShowDropdown] = useState(false);
  // const [inputValue, setInputValue] = useState("");
  // const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  // const [receiveEmails, setReceiveEmails] = useState(false);
  // const [agreeTerms, setAgreeTerms] = useState(false);
  // const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);

  // console.log(inputValue);
  // console.log(selectedCountry);
  // console.log(isCaptchaVerified);

  // const handleCaptchaChange = (value: string | null) => {
  //   if (value) {
  //     setIsCaptchaVerified(true);
  //   } else {
  //     setIsCaptchaVerified(false);
  //   }
  // };

  // const handleCountrySelect = (country: Country) => {
  //   setSelectedCountry(country);
  //   setInputValue(country.name);
  //   setShowDropdown(false);
  //   setUser({ ...user, country: country.name });
  // };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setInputValue(value);
  //   setShowDropdown(true);
  // };

  // const filteredCountries = countries.filter((country) =>
  //   country.name.toLowerCase().includes(inputValue.toLowerCase())
  // );
  // const handleReceiveEmailsChange = () => {
  //   setReceiveEmails(!receiveEmails);
  // };

  // const handleAgreeTermsChange = () => {
  //   setAgreeTerms(!agreeTerms);
  // };
  useEffect(() => {
    if (error) {
      if ("data" in error) {
        const errorMessage =
          (error as FetchBaseQueryError & { data: LoginError }).data.message ||
          "Unknown error";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } else if (data) {
      toast.success(data.message);
      navigate("/login");
    }
  }, [error, data, navigate]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) {
      navigate("/");
      toast.error("Login Failed");
    }

    // if (!isCaptchaVerified) {
    //   toast.error("Please verify that you are not a robot.");
    //   return;
    // }

    // Handle form submission
    const signUp = {
      fullname,
      email,
      country,
      password,
    };
    register(signUp);
  };

  const onchange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (typeof e.target === "object" && e.target !== null) {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
    }
  };

  return (
    <div className="py-16">
      <ToastContainer />

      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-md lg:max-w-7xl">
        <div
          className="hidden md:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1602345397613-0934a8812d23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRldnxlbnwwfHwwfHx8MA%3D%3D')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2 md:1/12">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            <img src={logo} alt="Motickets logo" />
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          {/* <a
            href="#"
            className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
          >
            <div className="px-4 py-3">
              <svg className="h-6 w-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00"
                />
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50"
                />
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2"
                />
              </svg>
            </div>
            <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">
              Sign up with Google
            </h1>
          </a> */}
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <Link
              to="#"
              className="text-xs text-center text-gray-500 uppercase"
            >
              or login with email
            </Link>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <form onSubmit={submitHandler}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Full name
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="name"
                name="fullname"
                value={fullname}
                onChange={onchange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                name="email"
                value={email}
                onChange={onchange}
              />
            </div>
            <div className="mt-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Country
              </label>
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              ></div>
              <select
                onClick={() => setShowDropdown(!showDropdown)}
                className="pl-8 pr-10 bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                name="country"
                onChange={onchange}
                value={country} // Ensure the selected value is reflected
              >
                {countriesList?.map((country) => (
                  <option key={country?.name} value={country?.name}>
                    {country?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                name="password"
                value={password}
                onChange={onchange}
              />
            </div>

            {/* <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={receiveEmails}
                  onChange={handleReceiveEmailsChange}
                />
                <span className="ml-2">
                  I'd like to receive emails from MoTickets about upcoming
                  events in my city.
                </span>
              </label>
            </div>
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={agreeTerms}
                  onChange={handleAgreeTermsChange}
                />
                <span className="ml-2">
                  I agree to MoTickets terms and Conditions.
                </span>
              </label>
            </div> */}

            {/* <ReCAPTCHA
              sitekey="6Le-5L4pAAAAAJuOoXkgUGsBy1ZgQxj81Qxh6TzK"
              onChange={handleCaptchaChange}
              className="mt-4"
            /> */}

            <div className="mt-8">
              <button
                type="submit"
                className="bg-[#25aae1] text-white font-bold py-3 px-4 w-full rounded disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Creating" : "Sign up"}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <Link to="/login" className="text-xs text-gray-500 uppercase">
                or sign in
              </Link>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
