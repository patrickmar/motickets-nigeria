import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  useGetHostQuery,
  useUpdateProfileMutation,
} from "../../redux/api/userApi";
import toast from "react-hot-toast";

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

const EditProfile = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);

  const [hostname, setHostName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [accountNo, setAccountNo] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [bank, setBank] = useState<string>("");
  const [bankCode, setBankCode] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  const navigate = useNavigate();

  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateProfileMutation();

  const { data } = useGetHostQuery(user?.id!, {
    skip: !user?.id,
  });
  console.log(data);
  const userData = data ? data[0] : null; // Get the first user

  useEffect(() => {
    if (userData) {
      setHostName(userData.hostname || "");
      setEmail(userData.email || "");
      setAccountNo(userData.accountNo || "");
      setAccountName(userData.accountName || "");
      setBank(userData.bank || "");
      setBankCode(userData.bankCode || "");
      setFacebook(userData.facebook || "");
      setTwitter(userData.twitter || "");
      setInstagram(userData.instagram || "");
      setWebsite(userData.website || "");
    }

    if (error) {
      toast.error((error as any)?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Updated");
      navigate(0);
    }
  }, [data, error, isSuccess, navigate, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gather the updated data
    const updatedUser = {
      id: user?.id,
      hostname,
      email,
      accountNo,
      accountName,
      bank,
      bankCode,
      facebook,
      twitter,
      instagram,
      website,
    };

    try {
      await updateProfile(updatedUser).unwrap();
    } catch (err) {
      console.error("Failed to update the user: ", err);
      toast.error("Failed to update the user");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[550px] bg-gray-500 p-12 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="hostname"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Full Name
          </label>
          <input
            type="text"
            id="hostname"
            name="hostname"
            className="w-full rounded-md border border-[#121212] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            placeholder="Full Name"
            value={hostname}
            onChange={(e) => setHostName(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="accountNo"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Account Number
          </label>
          <input
            type="text"
            name="accountNo"
            id="accountNo"
            placeholder="Account Number"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="accountName"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Account Name
          </label>
          <input
            type="text"
            name="accountName"
            id="accountName"
            placeholder="Account Name"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="bank"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Bank
          </label>
          <input
            type="text"
            name="bank"
            id="bank"
            placeholder="Bank Name"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="facebook"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Facebook
          </label>
          <input
            type="text"
            name="facebook"
            id="facebook"
            placeholder="Facebook"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="twitter"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            X
          </label>
          <input
            type="text"
            name="twitter"
            id="twitter"
            placeholder="X"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="instagram"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Instagram
          </label>
          <input
            type="text"
            name="instagram"
            id="instagram"
            placeholder="Instagram"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="website"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Website
          </label>
          <input
            type="text"
            name="website"
            id="website"
            placeholder="Website"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button
            type="submit"
            className="hover:shadow-form w-full rounded-md bg-[#25aae1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
