import React, { useState } from "react";
import "./style.css";
// import avatar from "../../assets/images/default_avatar.jpg";
import HostProfile from "./HostProfile";
import CreateEventForm from "../create";
import Financial from "./Financial";
import TermsAndConditions from "../terms";
import MyEvent from "./MyEvent";
// import { useNavigate } from "react-router-dom";
import FinancialCard from "./FinancialCard";
import EditProfile from "./EditProfile"; // Import the new EditProfile component
import { useAvatar } from "../../context/AvatarContext";

const Dashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const [selectedEventOption, setSelectedEventOption] =
    useState<string>("CreateEvent");
  const [selectedProfileOption, setSelectedProfileOption] =
    useState<string>("ViewProfile"); // New state for profile dropdown
  const [viewingFinancialReport, setViewingFinancialReport] =
    useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // const navigate = useNavigate();
  const { avatarUrl } = useAvatar();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    setViewingFinancialReport(false);
    setIsSidebarOpen(false); // Close sidebar on menu item click
  };

  const renderSelectedContent = () => {
    if (selectedMenu === "Financial" && viewingFinancialReport) {
      return <Financial />;
    }

    switch (selectedMenu) {
      case "Profile":
        return selectedProfileOption === "EditProfile" ? (
          <EditProfile />
        ) : (
          <HostProfile />
        );
      case "Financial":
        return (
          <FinancialCard onViewReport={() => setViewingFinancialReport(true)} />
        );
      case "FAQ":
        return <TermsAndConditions />;
      case "Event":
        return selectedEventOption === "CreateEvent" ? (
          <CreateEventForm />
        ) : (
          <MyEvent />
        );
      default:
        return (
          <div className="card--container bg-gray-100">
            <div className="card--container">
              <h3 className="main--title">Today's data</h3>
              <div className="card--wrapper">
                <div className="payment--card light-red">
                  <div className="card--header">
                    <div className="amount">
                      <span className="title">Transactions</span>
                      <span className="amount--value">£0.00</span>
                    </div>
                    <i className="fas fa-pound-sign icon"></i>
                  </div>
                </div>
                <div className="payment--card light-purple">
                  <div className="card--header">
                    <div className="amount">
                      <span className="title">Payment Order</span>
                      <span className="amount--value">£0.00</span>
                    </div>
                    <i className="fas fa-list icon"></i>
                  </div>
                </div>
                <div className="payment--card light-green">
                  <div className="card--header">
                    <div className="amount">
                      <span className="title">Events</span>
                      <span className="amount--value">All Hosted Events</span>
                    </div>
                    <i className="fas fa-check icon dark-blue"></i>
                  </div>
                </div>
                <div className="payment--card light-blue">
                  <div className="card--header">
                    <div className="amount">
                      <span className="title">Bookings</span>
                      <span className="amount--value">£0.00</span>
                    </div>
                    <i className="fas fa-users icon dark-green"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo"></div>
        <ul className="menu">
          <li
            className={selectedMenu === "Dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("Dashboard")}
          >
            <a href="#">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li
            className={
              selectedMenu === "Profile" ? "active dropdown" : "dropdown"
            }
            onClick={() => handleMenuClick("Profile")}
          >
            <a href="#">
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </a>
            {selectedMenu === "Profile" && (
              <ul className="dropdown-menu">
                <li
                  className={
                    selectedProfileOption === "ViewProfile" ? "active" : ""
                  }
                  onClick={() => setSelectedProfileOption("ViewProfile")}
                >
                  <i className="fas fa-eye"></i> <span>View Profile</span>
                </li>
                <li
                  className={
                    selectedProfileOption === "EditProfile" ? "active" : ""
                  }
                  onClick={() => setSelectedProfileOption("EditProfile")}
                >
                  <i className="fas fa-edit"></i> <span>Edit Profile</span>
                </li>
              </ul>
            )}
          </li>
          <li
            className={selectedMenu === "Financial" ? "active" : ""}
            onClick={() => handleMenuClick("Financial")}
          >
            <a href="#">
              <i className="fas fa-chart-bar"></i>
              <span>Financial</span>
            </a>
          </li>
          <li
            className={selectedMenu === "FAQ" ? "active" : ""}
            onClick={() => handleMenuClick("FAQ")}
          >
            <a href="#">
              <i className="fas fa-question-circle"></i>
              <span>FAQ</span>
            </a>
          </li>
          <li
            className={
              selectedMenu === "Event" ? "active dropdown" : "dropdown"
            }
            onClick={() => handleMenuClick("Event")}
          >
            <a href="#">
              <i className="fas fa-calendar-alt"></i>
              <span>Event</span>
            </a>
            {selectedMenu === "Event" && (
              <ul className="dropdown-menu">
                <li
                  className={
                    selectedEventOption === "CreateEvent" ? "active" : ""
                  }
                  onClick={() => setSelectedEventOption("CreateEvent")}
                >
                  <i className="fas fa-plus"></i> <span>Create Event</span>
                </li>
                <li
                  className={selectedEventOption === "MyEvent" ? "active" : ""}
                  onClick={() => setSelectedEventOption("MyEvent")}
                >
                  <i className="fas fa-info-circle"></i> <span>My Events</span>
                </li>
              </ul>
            )}
          </li>
          <li className="logout">
            <a href="#">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="hamburger" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </div>
      <div className="main--content">
        <div className="header--wrapper">
          <div className="header--title">
            <h2>{selectedMenu}</h2>
          </div>
          <div className="user--info">
            <div className="search--box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search" />
            </div>
            <img src={avatarUrl} alt="User Avatar" />
          </div>
        </div>
        {renderSelectedContent()}
      </div>
    </section>
  );
};

export default Dashboard;
