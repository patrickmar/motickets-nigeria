import React, { FormEvent, useEffect, useState } from "react";
import logo from "../../../assets/logo/motickets_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../redux/api/authApi";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setIsAuthenticated, setUser } from "../../../features/userSlice";

interface CustomError {
  data: {
    message: string;
  };
}
interface User {
  id: string;
  email: string;
  image: string | null;
  submerchantId: string | null;
  fullname: string;
  update_flag: string;
  branchId: string;
  accountNo: string;
  city: string | null;
  state: string | null;
  accountName: string;
  dateOfBirth: string | null;
  gender: string | null;
  bank: string;
  bankcode: string;
  bvn: string;
  message: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  date: string;
  dateCreated: string;
  phone: string | null;
  country: string; // Make sure 'country' exists in the response
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [login, { isLoading, error }] = useLoginMutation();
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const customError = error as CustomError;
      console.log(customError?.data?.message || "An error occurred");
    }
  }, [error]);

  const handleLoginSuccess = (userData: User) => {
    if (!userData || !userData.id) {
      toast.error("User not found or invalid credentials.");
      return; // Prevent navigation
    }

    // Assuming userData.id should be the hostId, perform the necessary check
    const hostId = userData.id; // or simply userData.id if it's the same as hostId
    if (!hostId) {
      toast.error("Host ID not found.");
      return; // Prevent navigation
    }

    dispatch(setUser(userData));
    dispatch(setIsAuthenticated(true));

    const updateFlag = parseInt(userData.update_flag, 10);
    if (updateFlag === 0) {
      navigate("/host");
    } else {
      navigate("/dashboard");
    }
  };

  const validateInputs = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      handleLoginSuccess(response);
    } catch (error) {
      const customError = error as FetchBaseQueryError & CustomError;
      if (customError?.data?.message.includes("wrong user id or password")) {
        toast.error("User does not exist or wrong password.");
      } else {
        toast.error(
          customError?.data?.message || "Login failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="py-32">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden md:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2 md:1/12">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            <img src={logo} alt="Motickets logo" />
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <form onSubmit={submitHandler}>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <Link to="/password/forgot" className="text-xs text-gray-500">
                  Forgot Password?
                </Link>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="bg-[#25aae1] text-white font-bold py-2 px-4 w-full rounded"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <Link to="/register" className="text-xs text-gray-500 uppercase">
                or sign up
              </Link>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
