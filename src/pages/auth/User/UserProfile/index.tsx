import React, { useEffect, useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useUpdateProfileMutation } from "../../../../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import HostLayer from "../../../../components/HostLayout";
import { useAvatar } from "../../../../context/AvatarContext";
import { Link } from "react-router-dom";

interface User {
  id: string;
  email: string;
  image: string | null;
  submerchantId: string | null;
  fullname: string | null;
  lastname: string | null;
  branchId: string;
  accountNo: string;
  city: string;
  state: string;
  accountName: string;
  dateOfBirth: string;
  gender: string;
  bank: string;
  bankcode: string;
  bvn: string;
  message: string;
}

const Profile = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);

  const [email, setEmail] = useState<string>("");
  const { avatarUrl } = useAvatar();

  const [fullname, setFullname] = useState<string>("");
  const navigate = useNavigate();

  const [updateProfile, { error, isSuccess }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setFullname(user?.fullname || "");
      setEmail(user?.email || "");
    }
    if (error) {
      toast.error((error as any)?.data?.message); // Type assertion may be needed based on error structure
    }
    if (isSuccess) {
      toast.success("User Updated");
      navigate(0);
    }
  }, [user, error, isSuccess, navigate]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const userData = {
      fullname,
      email,
    };
    updateProfile(userData);
  };
  console.log(submitHandler);
  const handlePasswordChange = () => {
    navigate("/profile_change");
  };

  const handleAvatarUpload = () => {
    // navigate("/upload-avatar");
    navigate("/host");
  };

  return (
    <div className="h-full  bg-[#0A0D36] p-8">
      <div className="bg-white rounded-lg shadow-xl mt-16 pb-8">
        <div className="w-full h-[250px]">
          <img
            alt="bluz"
            src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
            className="w-full h-full rounded-tl-lg rounded-tr-lg"
          />
        </div>
        <div className="flex flex-col items-center -mt-20">
          <img
            alt="avatarUrl"
            src={avatarUrl}
            className="w-40 border-4 border-white rounded-full"
          />
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl">{user?.fullname}</p>
            <span className="bg-blue-500 rounded-full p-1" title="Verified">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-100 h-2.5 w-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </span>
          </div>
          <p className="text-gray-700">
            Senior Software Engineer at Tailwind CSS
          </p>
          <p className="text-sm text-gray-500">New York, USA</p>
        </div>
        <div className="flex-1 flex flex-col items-center lg:items-center justify-center px-8 mt-2">
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={handlePasswordChange}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
              </svg>
              <span>Update Password</span>
            </button>
            <button
              onClick={handleAvatarUpload}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a3.5 3.5 0 0 0-3.5 3.5h-1A2.5 2.5 0 0 0 5 8v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a2.5 2.5 0 0 0-2.5-2.5h-1A3.5 3.5 0 0 0 12 2zm0 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-1 10.5v1h2v-1h-2zm-1-2.5h4v-5h-4v5z" />
              </svg>
              <span>Update Image</span>
            </button>

            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Switch to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="my-4 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 bg-[#0A0D36]">
        <div className="w-full flex flex-col lg:w-1/3 ">
          <div className="flex-1 bg-gray-300 rounded-lg shadow-xl p-8">
            <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
            <ul className="mt-2 text-gray-700">
              <ul className="mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24">Full name:</span>
                  <span className="text-gray-700">{user?.fullname}</span>
                </li>
                {/* <li className="flex border-b py-2">
                  <span className="font-bold w-24">Birthday:</span>
                  <span className="text-gray-700">24 Jul, 1991</span>
                </li> */}
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Joined:</span>
                  <span className="text-gray-700">
                    10 Jan 2022 (25 days ago) {user?.id}
                  </span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Mobile:</span>
                  <span className="text-gray-700">(123) 123-1234</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Email:</span>
                  <span className="text-gray-700">{user?.email}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Location:</span>
                  <span className="text-gray-700">New York, US</span>
                </li>
                {/* <li className="flex border-b py-2">
                  <span className="font-bold w-24">Languages:</span>
                  <span className="text-gray-700">English, Spanish</span>
                </li> */}
                <li className="flex items-center border-b py-2 space-x-2">
                  <span className="font-bold w-24">Elsewhere:</span>
                  <Link to="#" title="Facebook">
                    <svg
                      className="w-5 h-5"
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 506.86 506.86"
                    >
                      <path
                        className="cls-1"
                        d="M506.86,253.43C506.86,113.46,393.39,0,253.43,0S0,113.46,0,253.43C0,379.92,92.68,484.77,213.83,503.78V326.69H149.48V253.43h64.35V197.6c0-63.52,37.84-98.6,95.72-98.6,27.73,0,56.73,5,56.73,5v62.36H334.33c-31.49,0-41.3,19.54-41.3,39.58v47.54h70.28l-11.23,73.26H293V503.78C414.18,484.77,506.86,379.92,506.86,253.43Z"
                        style={{ fill: "#1877f2" }} // Inline style for cls-1
                      ></path>
                      <path
                        className="cls-2"
                        d="M352.08,326.69l11.23-73.26H293V205.89c0-20,9.81-39.58,41.3-39.58h31.95V104s-29-5-56.73-5c-57.88,0-95.72,35.08-95.72,98.6v55.83H149.48v73.26h64.35V503.78a256.11,256.11,0,0,0,79.2,0V326.69Z"
                        style={{ fill: "#fff" }} // Inline style for cls-2
                      ></path>
                    </svg>
                  </Link>
                  <Link to="#" title="Twitter">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 333333 333333"
                      shape-rendering="geometricPrecision"
                      text-rendering="geometricPrecision"
                      image-rendering="optimizeQuality"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    >
                      <path
                        d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm90493 110539c-6654 2976-13822 4953-21307 5835 7669-4593 13533-11870 16333-20535-7168 4239-15133 7348-23574 9011-6787-7211-16426-11694-27105-11694-20504 0-37104 16610-37104 37101 0 2893 320 5722 949 8450-30852-1564-58204-16333-76513-38806-3285 5666-5022 12109-5022 18661v4c0 12866 6532 24246 16500 30882-6083-180-11804-1876-16828-4626v464c0 17993 12789 33007 29783 36400-3113 845-6400 1313-9786 1313-2398 0-4709-247-7007-665 4746 14736 18448 25478 34673 25791-12722 9967-28700 15902-46120 15902-3006 0-5935-184-8860-534 16466 10565 35972 16684 56928 16684 68271 0 105636-56577 105636-105632 0-1630-36-3209-104-4806 7251-5187 13538-11733 18514-19185l17-17-3 2z"
                        fill="#1da1f2"
                      ></path>
                    </svg>
                  </Link>
                  <Link to="#" title="LinkedIn">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 333333 333333"
                      shape-rendering="geometricPrecision"
                      text-rendering="geometricPrecision"
                      image-rendering="optimizeQuality"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    >
                      <path
                        d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm-18220 138885h28897v14814l418 1c4024-7220 13865-14814 28538-14814 30514-1 36157 18989 36157 43691v50320l-30136 1v-44607c0-10634-221-24322-15670-24322-15691 0-18096 11575-18096 23548v45382h-30109v-94013zm-20892-26114c0 8650-7020 15670-15670 15670s-15672-7020-15672-15670 7022-15670 15672-15670 15670 7020 15670 15670zm-31342 26114h31342v94013H96213v-94013z"
                        fill="#0077b5"
                      ></path>
                    </svg>
                  </Link>
                  <Link to="#" title="Github">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="0"
                      height="0"
                      shape-rendering="geometricPrecision"
                      text-rendering="geometricPrecision"
                      image-rendering="optimizeQuality"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      viewBox="0 0 640 640"
                    >
                      <path d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z"></path>
                    </svg>
                  </Link>
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-2/3">
          <HostLayer />
          {/* <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Update Your Account
                  </h1>
                  <form
                    className="space-y-4 md:space-y-6"
                    onSubmit={submitHandler}
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Full Name
                      </label>
                      <input
                        type="name"
                        name="firstname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        placeholder="Chizoba@gmail.com"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
