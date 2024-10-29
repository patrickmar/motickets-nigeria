import React, { createContext, useState, useContext, useEffect } from "react";
import default_avatar from "../assets/images/default_avatar.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AvatarContextType {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.image
      ? `${process.env.REACT_APP_BASEURL}/${user.image}`
      : default_avatar
  );

  useEffect(() => {
    if (user) {
      const newAvatarUrl = user.image
        ? `${process.env.REACT_APP_BASEURL}/${user.image}`
        : default_avatar;
      setAvatarUrl(newAvatarUrl);
      localStorage.setItem("avatarUrl", newAvatarUrl);
    }
  }, [user?.image]);

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};
