import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../../../../context/AvatarContext";
import default_avatar from "../../../../assets/images/default_avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../../features/userSlice";
import { RootState } from "../../../../redux/store";
import toast from "react-hot-toast";

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
  country: string;
}

function AvatarUploadForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const [previewSrc, setPreviewSrc] = useState<string>(
    avatarUrl || default_avatar
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;

  useEffect(() => {
    if (user && user.image) {
      setPreviewSrc(`${process.env.REACT_APP_BASEURL}/${user.image}`);
    } else {
      setPreviewSrc(default_avatar);
    }
  }, [user]);

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setPreviewSrc(src);
      setSelectedFile(file);
      return () => URL.revokeObjectURL(src);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file before submitting.");
      return;
    }

    if (!user || !user.id) {
      alert("User information is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("hostid", user.id);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/eventhost/updatepics`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Parsed response data:", data);

      if (
        !data.error &&
        data.user &&
        data.user.length > 0 &&
        data.user[0].img
      ) {
        const imageUrl = `${process.env.REACT_APP_BASEURL}/${data.user[0].img}`;
        console.log("New image URL:", imageUrl);

        const updatedUser = {
          ...user,
          image: data.user[0].img,
        };

        dispatch(setUser(updatedUser));
        setAvatarUrl(imageUrl);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success(data.message || "Image uploaded successfully!");
        navigate("/dashboard");
      } else {
        toast.error(
          data.message || "Upload successful, but no valid image path received."
        );
      }
    } catch (error) {
      console.error("Error uploading the image:", error);
      toast.error("An error occurred during the upload. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center h-screen items-center space-x-6">
        <div className="shrink-0">
          <img
            id="preview_img"
            className="h-16 w-16 object-cover rounded-full"
            src={previewSrc}
            alt="Current profile photo"
          />
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            onChange={loadFile}
            className="block w-full text-sm text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </label>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default AvatarUploadForm;
