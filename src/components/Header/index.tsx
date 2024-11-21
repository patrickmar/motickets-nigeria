import React, { useState, useEffect } from "react";
// import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import ContentWrapper from "../ContentWrapper";
import logo from "../../assets/logo/motickets_logo_-.png";
import default_avatar from "../../assets/images/default_avatar.jpg";
import DropdownCountry from "../CountryDropdown";
import "./styles.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../features/userSlice";
import { useAvatar } from "../../context/AvatarContext";

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
  facebook: string;
  twitter: string;
  instagram: string;
  website: string;
  about: string;
  bankCode: string;
  dateCreated: string;
  hostname: string;
}

const Header: React.FC = () => {
  const [show, setShow] = useState<string>("top");
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  console.log(query);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { avatarUrl, setAvatarUrl } = useAvatar();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;

  const hostid = user?.id || "";
  console.log("User:", user);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("hostid:", hostid);
  console.log(avatarUrl);
  console.log(setQuery);

  // useEffect(() => {
  //   if (!hostid) {
  //     navigate("/login");
  //   }
  // }, [hostid, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  // const searchQueryHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter" && query.length > 0) {
  //     navigate(`/search/${query}`);
  //     setTimeout(() => {}, 1000);
  //   }
  // };

  // const openSearch = () => {
  //   setMobileMenu(false);
  // };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const navigationHandler = (type: string) => {
    navigate(type);
    setMobileMenu(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const closeDropdown = () => {
    setIsVisible(false);
  };
  console.log("Avatar URL before rendering:", avatarUrl);

  const handleLogout = () => {
    setAvatarUrl(default_avatar); // Reset to default avatar
    localStorage.removeItem("avatarUrl");
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className={`header ${show} ${mobileMenu ? "mobileView" : ""}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Motickets logo" />
        </div>

        {/* Menu Items */}
        <ul className={`menuItems ${mobileMenu ? "mobileMenuVisible" : ""}`}>
          <li className="menuItem" onClick={() => navigationHandler("/")}>
            Home
          </li>
          <li
            className="menuItem"
            onClick={() => navigationHandler("/organisers")}
          >
            For Business
          </li>
          <li className="menuItem" onClick={() => navigationHandler("/events")}>
            All Events
          </li>
          <li
            className="menuItem"
            onClick={() => navigationHandler("/create-event")}
          >
            Create Event
          </li>
        </ul>

        {/* DropdownCountry Component */}
        <li className="menuItem">
          <DropdownCountry />
        </li>

        {user && isAuthenticated ? (
          <li className="menuItem">
            <div className="border-t border-gray-200 flex justify-end">
              <div className="relative">
                <img
                  onClick={toggleVisibility}
                  className="h-10 w-10 rounded-full cursor-pointer"
                  src={avatarUrl || default_avatar} // Use avatar URL from context or default avatar
                  alt="User Avatar"
                />
                <div
                  className={`absolute transition-all duration-300 ease-in-out ${
                    isVisible ? "block" : "hidden"
                  } top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10`}
                >
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={closeDropdown}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        closeDropdown();
                        handleLogout();
                      }}
                      className="block w-full text-left px-8 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ) : (
          <Link
            to="/login"
            className="py-2 px-6 bg-[#25aae1] rounded-md text-white"
          >
            LOGIN
          </Link>
        )}

        {/* Hamburger Menu */}
        <div className="mobileMenuItems">
          {mobileMenu ? (
            <VscChromeClose onClick={toggleMobileMenu} />
          ) : (
            <SlMenu onClick={toggleMobileMenu} />
          )}
        </div>
      </ContentWrapper>
    </header>
  );
};

export default Header;
