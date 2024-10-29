// components/HostLayer.js
import React, { useState, ChangeEvent, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUpdateFlag } from "../../features/userSlice";
import { useUpdateHostMutation } from "../../redux/api/userApi";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { isValidPhoneNumber } from "libphonenumber-js";

interface FormData {
  hostid: string;
  username: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  website: string;
  about: string;
  bank: string;
  accountName: string;
  currency: string;
  sortCode: string;
  accountNo: string;
  confirmAccountNumber: string;
  phone: string;
}
interface User {
  id: string;
  email: string;
  image: string | null;
  submerchantId: string | null;
  fullname: string;
  update_flag: string; // This should be a string as per your provided object
  branchId: string;
  accountNo: string;
  about: string;
  city: string;
  state: string;
  accountName: string;
  dateOfBirth: string;
  gender: string;
  bank: string;
  bankcode: string;
  bvn: string;
  message: string;
  website: string;
  facebook: string;
  instagram: string;
  date: string;
  phone: string;
}

// interface UserState {
//   isAuthenticated: boolean;
// }

const HostLayer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    hostid: "",
    username: "",
    email: "",
    facebook: "",
    twitter: "",
    instagram: "",
    website: "",
    about: "",
    bank: "",
    accountName: "",
    currency: "",
    sortCode: "",
    accountNo: "",
    confirmAccountNumber: "",
    phone: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);

  const [updateHost, { isLoading, isSuccess, error }] = useUpdateHostMutation();

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      phone: value || "",
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        email: user.email,
      }));
    }
    if (error) {
      toast.error((error as any)?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Updated");
    }
  }, [user, error, isSuccess]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  const validateSortCode = (sortCode: string): boolean => {
    // Regular expression to match sort code format: xx-xx-xx or xxxxxx
    const sortCodeRegex = /^(\d{2}-\d{2}-\d{2}|\d{6})$/;
    return sortCodeRegex.test(sortCode);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    if (!validateSortCode(formData.sortCode)) {
      toast.error(
        "Invalid sort code. Sort code should be in format xx-xx-xx or xxxxxx"
      );
      return;
    }

    if (!isValidPhoneNumber(formData.phone)) {
      toast.error("Invalid phone number");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        hostid: user?.id, // safely append user id
      };
      console.log("Data to send:", dataToSend); // Check console to verify hostid is set

      await updateHost(dataToSend).unwrap();
      dispatch(setUpdateFlag(1)); // Ensure this line is executed
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update host profile: ", error);
      toast.error("Failed to update host profile. Please try again.");
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="py-32  lg:mx-32 mx-2 bg-gray-300/10 p-8 rounded-md ">
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-12">
            <div className="border-b border-gray-300/10 pb-12">
              <h2 className="text-lg font-semibold leading-30.8 text-gray-100">
                Create Host Account
              </h2>
              <p className="mt-8 text-md leading-6 text-gray-100">
                Personal Details
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-100">
                Your contact information is kept private and shown only to
                attendees who book a ticket
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Enter host name *
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-900 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="block flex-1 rounded-md py-2 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter Host Name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Email address *
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={user?.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phoneNo"
                    className="block mb-2 text-sm font-medium text-gray-100"
                  >
                    Phone Number *
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="GB"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="block w-full rounded-md border-gray-300 bg-transparent shadow-sm focus:ring-gray-100 focus:border-gray-100 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-12">
            <div className="border-b border-gray-400/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-100">
                Other Information
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="facebook"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Facebook (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="facebook"
                      id="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Twitter (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="twitter"
                      id="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white py-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="instagram"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Instagram (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="instagram"
                      id="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Website (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={4}
                      value={formData.about}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      placeholder="Write a few sentences about yourself or company."
                      maxLength={250}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-12 ">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-100">
                Banking Details
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="bankCountry"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Bank Name *
                  </label>
                  <div className="mt-2 ">
                    <input
                      type="text"
                      name="bank"
                      id="bank"
                      value={formData.bank}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="accountName"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Account Name *
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="accountName"
                      id="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Currency *
                  </label>
                  <div className="mt-2">
                    <select
                      name="currency"
                      id="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    >
                      <option value="" disabled>
                        Select currency *
                      </option>
                      <option value="GBP">GBP</option>
                      <option value="NGN">NGN</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="sortCode"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Sort Code *
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sortCode"
                      id="sortCode"
                      value={formData.sortCode}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Account Number *
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="accountNo"
                      id="accountNo"
                      value={formData.accountNo}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="confirmAccountNumber"
                    className="block text-sm font-medium leading-6 text-gray-100"
                  >
                    Confirm Account Number *
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="confirmAccountNumber"
                      id="confirmAccountNumber"
                      value={formData.confirmAccountNumber}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="text-sm font-semibold leading-6 text-red-100 bg-red-600 rounded-md py-2 px-6"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="rounded-md bg-[#25aae1] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>
      {isSuccess && (
        <p className="text-green-500 mt-4">Profile updated successfully!</p>
      )}
      {error && (
        <p className="text-red-500 mt-4">
          Failed to update profile. Please try again.
        </p>
      )}
    </div>
  );
};

export default HostLayer;
