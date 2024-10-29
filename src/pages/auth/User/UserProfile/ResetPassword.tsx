import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../../../redux/api/userApi";
import toast from "react-hot-toast";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Initialize email state
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { token } = useParams<{ token: string }>();
  console.log(token);
  const navigate = useNavigate();
  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!email) {
      toast.error("Please provide your email address.");
      return;
    }
    resetPassword({ email, newpassword: password });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Your password reset is successful");
      navigate("/login");
    }

    if (error) {
      toast.error(
        (error as any)?.data?.message || "An error occurred. Please try again."
      );
    }
  }, [isSuccess, error, navigate]);

  return (
    <div className="w-full max-w-lg mx-auto py-24">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Reset your password
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-3 px-4 block w-full border-2 border-gray-500 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-3 px-4 block w-full border-2 border-gray-500 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="py-3 px-4 block w-full border-2 border-gray-500 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
