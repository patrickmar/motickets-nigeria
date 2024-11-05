import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  useGetHostQuery,
  useUpdateProfileMutation,
} from "../../redux/api/userApi";
import toast from "react-hot-toast";
import default_avatar from "../../assets/images/default_avatar.jpg";
import { setUpdateStatus } from "../../features/eventSlice";
import { Link } from "react-router-dom";
import { useAvatar } from "../../context/AvatarContext";

interface User {
  id: string;
  fullname: string;
  pin: string;
  phone: string | null;
  img: string;
  programId: string;
  merchantId: string;
  hostname: string;
  email: string;
  branchId: string;
  password: string;
  about: string;
  bvn: string;
  bank: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  default: string;
  locked: string;
  dateCreated: string;
  email_sub_flag: string | null;
  update_flag: string;
  deactivate: string | null;
  reasons: string | null;
  date: string;
  time: string;
  ip: string;
}
// Define an interface for CSS classes
// interface CSSClasses {
//   cls1: string;
//   cls2: string;
// }

const HostProfile = () => {
  // Define CSS classes
  // const classes: CSSClasses = {
  //   cls1: "fill:#1877f2;",
  //   cls2: "fill:#fff;",
  // };

  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);
  const { avatarUrl } = useAvatar();

  const [dateCreated, setDateCreated] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // const [about, setAbout] = useState<string>("");
  const [bankCode, setBankCode] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");

  console.log(dateCreated);
  console.log(email);
  console.log(bankCode);
  console.log(instagram);
  console.log(facebook);

  const [hostname, setHostName] = useState<string>("");
  console.log(hostname);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(twitter);
  console.log(accountName);
  const [updateProfile, { error, isSuccess }] = useUpdateProfileMutation();
  console.log(updateProfile);
  const updateStatus = useSelector(
    (state: RootState) => state.event.updateStatus
  );

  const { data } = useGetHostQuery(user?.id!, {
    skip: !user?.id,
  });
  console.log(data);
  const userData = data ? data[0] : null; // Get the first user

  useEffect(() => {
    if (userData) {
      setHostName(userData.hostname || "");
      setEmail(userData.email || "");
      setAccountName(userData.accountName || "");
      setBankCode(userData.bankCode || "");
      setInstagram(userData.instagram || "");
      setFacebook(userData.facebook || "");
      setTwitter(userData.twitter || "");
      setDateCreated(userData.dateCreated || "");
      // You can set other fields similarly
    }

    if (error) {
      toast.error((error as any)?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Updated");
      navigate(0);
    }
  }, [data, error, isSuccess, navigate, userData]);
  useEffect(() => {
    if (updateStatus || data || user) {
      dispatch(setUpdateStatus(false)); // reset update status to false
    }
  }, [updateStatus, data, user, dispatch]);

  return (
    <div className="h-full bg-[#0A0D36] p-8 ">
      <div className="bg-white rounded-lg shadow-xl pb-8 mb-12">
        <div className="w-full h-[250px]">
          <img
            src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
            className="w-full h-full rounded-tl-lg rounded-tr-lg"
            alt="blue"
          />
        </div>
        <div className="flex flex-col items-center -mt-20">
          <Link to="/dashboard/avatar_upload">
            <img
              alt="bestthing"
              src={avatarUrl || default_avatar}
              className="w-40 h-40 border-4 border-white rounded-full"
            />
          </Link>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl">{userData?.hostname}</p>
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
        </div>
        <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2">
          <div className="flex items-center space-x-4 mt-2"></div>
        </div>
      </div>

      <div className="bg-white mx-auto justify-center max-w-2xl shadow overflow-hidden sm:rounded-lg">
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.hostname}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.email}{" "}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Account Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.accountName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Account Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.accountNo}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Bank</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.bank}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date Joined</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.dateCreated}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Sort Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.bankCode}{" "}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Instagram</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.instagram}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Twitter</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.twitter}{" "}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Facebook</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.facebook}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData?.about}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    // </div>
    // </div>
  );
};

export default HostProfile;
