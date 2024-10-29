import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../../../redux/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import toast from "react-hot-toast";

interface User {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);
  useEffect(() => {
    if (error) {
      toast.error((error as any)?.data?.message);
    }
    if (isSuccess) {
      toast.success("Email sent. Please check your inbox");
    }
  }, [error, isSuccess, navigate]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    forgotPassword({ email });
  };

  return (
    <div className="w-full   max-w-lg mx-auto py-24">
      <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Forgot password?
            </h1>
          </div>

          <div className="mt-5">
            <form onSubmit={submitHandler}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full border-2 border-gray-500 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  {isLoading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
