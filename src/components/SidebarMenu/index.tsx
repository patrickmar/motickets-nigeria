import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  name: string;
  url: string;
  icon: string;
}

const Index: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      name: "Profile",
      url: "/me/profile",
      icon: "fas fa-user",
    },
    {
      name: "Update profile",
      url: "/me/update_profile",
      icon: "fas fa-user",
    },
    {
      name: "Update Password",
      url: "/me/update_password",
      icon: "fas fa-user-circle",
    },
    {
      name: "Upload Avatar",
      url: "/me/upload_avatar",
      icon: "fas fa-lock",
    },
  ];

  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  const handleMenuItemclick = (menuItemUrl: string) => {
    setActiveMenuItem(menuItemUrl);
  };

  return (
    <div className="list-group mt-5 pl-4">
      {menuItems?.map((menuItem, index) => (
        <Link
          to={menuItem.url}
          onClick={() => handleMenuItemclick(menuItem.url)}
          key={index}
          className={`fw-bold list-group-item list-group-item-action ${
            activeMenuItem.includes(menuItem.url) ? "active" : ""
          }`}
          aria-current={`${
            activeMenuItem.includes(menuItem.url) ? "true" : "false"
          }`}
        >
          <i className={`${menuItem.icon} fa-fw pe-2`}></i> {menuItem.name}
        </Link>
      ))}
    </div>
  );
};

export default Index;
