import React, { useState, useEffect } from "react";
import "./style.css";
import HostProfile from "./HostProfile";
import CreateEventForm from "../create";
import TermsAndConditions from "../terms";
import MyEvent from "./MyEvent";
import { useNavigate } from "react-router-dom";
import FinancialCard from "./FinancialCard";
import FinancialTable from "./Financial";
import EditProfile from "./EditProfile";
import { useAvatar } from "../../context/AvatarContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetHostEventByIdQuery } from "../../redux/api/eventApi";

interface Event {
  sn: string;
  title: string;
  ticketCategories: { price: string }[];
  date: string;
  imgs: { img: string }[];
  slug: String;
}

interface User {
  id: string;
}

interface TicketData {
  id: string;
  user_id: string;
  lname: string;
  fname: string;
  email: string;
  ticket_class: string;
  amount: string;
  pay_reference: string;
  buy_date_time: string;
  used: string;
  event_id: string;
}

const Dashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const [selectedEventOption, setSelectedEventOption] =
    useState<string>("CreateEvent");
  const [selectedProfileOption, setSelectedProfileOption] =
    useState<string>("ViewProfile");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalTransactions: 0, // Changed from totalTickets to totalTransactions
    totalTickets: 0, // Keep track of total tickets too
    usedTickets: 0,
    uniqueCustomers: 0,
  });
  const [allTicketData, setAllTicketData] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { avatarUrl } = useAvatar();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;
  const { data: events } = useGetHostEventByIdQuery(user?.id!, {
    skip: !user?.id,
  });

  // Fetch all ticket data from Financial API
  useEffect(() => {
    const fetchAllTicketData = async () => {
      if (!events?.data) return;

      setIsLoading(true);
      try {
        const allTickets: TicketData[] = [];

        // Fetch ticket data for each event
        for (const event of events.data) {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BASEURL}/eventhost/ticketsales_report/${event.sn}`,
            );

            if (response.ok) {
              const ticketData = await response.json();
              if (Array.isArray(ticketData)) {
                allTickets.push(...ticketData);
              }
            }
          } catch (error) {
            console.error(
              `Error fetching tickets for event ${event.sn}:`,
              error,
            );
          }
        }

        setAllTicketData(allTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (events?.data) {
      fetchAllTicketData();
    }
  }, [events]);
  console.log(events?.data);

  // Calculate dashboard statistics using actual data
  useEffect(() => {
    if (events?.data) {
      const eventList: Event[] = events.data;
      const today = new Date();

      // Calculate statistics from events
      const totalEvents = eventList.length;
      const upcomingEvents = eventList.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      }).length;

      // Calculate statistics from actual ticket data
      let totalRevenue = 0;
      let totalTickets = 0;
      let usedTickets = 0;
      const uniqueTransactions = new Set<string>();
      const uniqueCustomers = new Set<string>();

      if (allTicketData.length > 0) {
        // Calculate actual revenue and counts
        allTicketData.forEach((ticket) => {
          totalRevenue += parseFloat(ticket.amount) || 0;
          totalTickets += 1;

          if (ticket.used === "1") {
            usedTickets += 1;
          }

          // Track unique payment references (transactions)
          uniqueTransactions.add(ticket.pay_reference);

          // Track unique customers by email
          uniqueCustomers.add(ticket.email);
        });
      } else {
        // Fallback to estimated data if no actual ticket data
        eventList.forEach((event) => {
          event.ticketCategories.forEach((category) => {
            const price = parseFloat(category.price) || 0;
            const estimatedTickets = 10; // Default estimate
            totalRevenue += price * estimatedTickets;
            totalTickets += estimatedTickets;
            uniqueTransactions.add(`est_${event.sn}_${category.price}`);
          });
        });
      }

      setDashboardStats({
        totalRevenue,
        totalEvents,
        upcomingEvents,
        totalTransactions: uniqueTransactions.size,
        totalTickets,
        usedTickets,
        uniqueCustomers: uniqueCustomers.size,
      });
    }
  }, [events, allTicketData]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    setSelectedEventId(null);
    setIsSidebarOpen(false);
  };

  const renderSelectedContent = () => {
    switch (selectedMenu) {
      case "Profile":
        return selectedProfileOption === "EditProfile" ? (
          <EditProfile />
        ) : (
          <HostProfile />
        );
      case "Financial":
        return selectedEventId ? (
          <FinancialTable
            eventid={selectedEventId}
            onBack={() => setSelectedEventId(null)}
          />
        ) : (
          <FinancialCard onViewReport={setSelectedEventId} />
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
          <div className="card--container">
            <div className="card--container">
              <h3 className="main--title">Event Dashboard Overview</h3>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="card--wrapper">
                    {/* Total Revenue Card */}
                    <div className="payment--card light-red">
                      <div className="card--header">
                        <div className="amount">
                          <span className="title">Total Revenue</span>
                          <span className="amount--value">
                            {allTicketData.length > 0
                              ? `£${dashboardStats.totalRevenue.toFixed(2)}`
                              : `₦${dashboardStats.totalRevenue.toFixed(2)}`}
                          </span>
                          <span className="amount-subtitle">
                            {allTicketData.length > 0
                              ? "Actual Revenue"
                              : "All Events"}
                          </span>
                        </div>
                        <i className="fas fa-pound-sign icon"></i>
                      </div>
                      <div className="card-footer">
                        <span className="trend-text">
                          {dashboardStats.totalEvents > 0
                            ? allTicketData.length > 0
                              ? `From ${dashboardStats.totalTransactions} transactions`
                              : `Avg: ₦${(dashboardStats.totalRevenue / dashboardStats.totalEvents).toFixed(2)} per event`
                            : "No events yet"}
                        </span>
                      </div>
                    </div>

                    {/* Total Events Card */}
                    <div className="payment--card light-purple">
                      <div className="card--header">
                        <div className="amount">
                          <span className="title">Total Events</span>
                          <span className="amount--value">
                            {dashboardStats.totalEvents}
                          </span>
                          <span className="amount-subtitle">
                            Created Events
                          </span>
                        </div>
                        <i className="fas fa-calendar-alt icon"></i>
                      </div>
                      <div className="card-footer">
                        <span className="trend-text">
                          {dashboardStats.upcomingEvents} upcoming
                        </span>
                      </div>
                    </div>

                    {/* Ticket Sales Card (shows number of transactions) */}
                    <div className="payment--card light-green">
                      <div className="card--header">
                        <div className="amount">
                          <span className="title">Ticket Sales</span>
                          <span className="amount--value">
                            {dashboardStats.totalTransactions}
                          </span>
                          <span className="amount-subtitle">
                            {allTicketData.length > 0
                              ? "Transactions"
                              : "Total Tickets"}
                          </span>
                        </div>
                        <i className="fas fa-ticket-alt icon dark-blue"></i>
                      </div>
                      <div className="card-footer">
                        <span className="trend-text">
                          {allTicketData.length > 0
                            ? `${dashboardStats.totalTickets} tickets • ${dashboardStats.uniqueCustomers} customers`
                            : "Estimated sales"}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="payment--card light-blue">
                      <div className="card--header">
                        <div className="amount">
                          <span className="title">Quick Actions</span>
                          <span className="amount--value">Manage</span>
                          <span className="amount-subtitle">Event Tools</span>
                        </div>
                        <i className="fas fa-cogs icon dark-green"></i>
                      </div>
                      <div className="card-footer">
                        <button
                          className="quick-action-btn"
                          onClick={() => {
                            setSelectedMenu("Event");
                            setSelectedEventOption("CreateEvent");
                          }}
                        >
                          Create Event
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Events Section */}
                  {events?.data && events.data.length > 0 && (
                    <div className="recent-events-section">
                      <h4 className="section-title">Your Recent Events</h4>
                      <div className="events-grid">
                        {events.data.slice(0, 3).map((event: Event) => {
                          // Calculate actual sales for this event
                          const eventTickets = allTicketData.filter(
                            (ticket) => ticket.event_id === event.sn,
                          );
                          const eventRevenue = eventTickets.reduce(
                            (sum, ticket) =>
                              sum + parseFloat(ticket.amount || "0"),
                            0,
                          );
                          const eventUsedTickets = eventTickets.filter(
                            (ticket) => ticket.used === "1",
                          ).length;
                          const eventUniqueTransactions = new Set(
                            eventTickets.map((ticket) => ticket.pay_reference),
                          ).size;
                          const eventUniqueCustomers = new Set(
                            eventTickets.map((ticket) => ticket.email),
                          ).size;

                          return (
                            <div key={event.sn} className="event-card">
                              <div className="event-image">
                                <img
                                  src={
                                    event.imgs[0]?.img
                                      ? `${process.env.REACT_APP_IMAGEURL}/${event.imgs[0]?.img}`
                                      : "/default-event.jpg"
                                  }
                                  alt={event.title}
                                  onError={(e) => {
                                    e.currentTarget.src = "/default-event.jpg";
                                  }}
                                />
                              </div>
                              <div className="event-info">
                                <h5 className="event-title">{event.title}</h5>
                                <p className="event-date">
                                  {new Date(event.date).toLocaleDateString()}
                                </p>
                                {allTicketData.length > 0 &&
                                eventTickets.length > 0 ? (
                                  <div className="event-stats">
                                    <p className="event-price">
                                      £{eventRevenue.toFixed(2)} revenue
                                    </p>
                                    <p className="event-price">
                                      {eventUniqueTransactions} transactions •{" "}
                                      {eventTickets.length} tickets
                                      {eventUniqueCustomers > 0 && (
                                        <span className="block">
                                          {eventUniqueCustomers} customers
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="event-price">
                                    £
                                    {event.ticketCategories.reduce(
                                      (min, cat) =>
                                        Math.min(
                                          min,
                                          parseFloat(cat.price) || 0,
                                        ),
                                      parseFloat(
                                        event.ticketCategories[0]?.price,
                                      ) || 0,
                                    )}{" "}
                                    - £
                                    {event.ticketCategories.reduce(
                                      (max, cat) =>
                                        Math.max(
                                          max,
                                          parseFloat(cat.price) || 0,
                                        ),
                                      0,
                                    )}
                                  </p>
                                )}
                                <button
                                  className="view-event-btn"
                                  onClick={() =>
                                    navigate(`/details/${event.slug}`)
                                  }
                                >
                                  View Event
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {events.data.length > 3 && (
                        <div className="view-all-container">
                          <button
                            className="view-all-btn"
                            onClick={() => {
                              setSelectedMenu("Event");
                              setSelectedEventOption("MyEvent");
                            }}
                          >
                            View All Events ({events.data.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty State */}
                  {(!events?.data || events.data.length === 0) && (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="fas fa-calendar-plus"></i>
                      </div>
                      <h4>No Events Yet</h4>
                      <p>
                        Start by creating your first event to see analytics and
                        manage tickets.
                      </p>
                      <button
                        className="create-first-event-btn"
                        onClick={() => {
                          setSelectedMenu("Event");
                          setSelectedEventOption("CreateEvent");
                        }}
                      >
                        Create Your First Event
                      </button>
                    </div>
                  )}

                  {/* Data Source Note */}
                  {allTicketData.length > 0 && (
                    <div className="data-note mt-6 text-center text-sm text-gray-600">
                      <i className="fas fa-info-circle mr-1"></i>
                      Showing actual data: {
                        dashboardStats.totalTransactions
                      }{" "}
                      transactions • {dashboardStats.totalTickets} tickets •{" "}
                      {dashboardStats.uniqueCustomers} customers
                    </div>
                  )}
                </>
              )}
            </div>

            <style>{`
              .amount-subtitle {
                font-size: 12px;
                color: black;
                display: block;
                margin-top: 4px;
              }
              
              .card-footer {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.2);
              }
              
              .trend-text {
                font-size: 11px;
                color: black;
              }
              
              .quick-action-btn {
                background: #25aae1;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                color: black;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.3s ease;
              }
              
              .quick-action-btn:hover {
                background: rgba(255,255,255,0.3);
              }
              
              .recent-events-section {
                margin-top: 30px;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              
              .section-title {
                margin-bottom: 20px;
                color: #333;
                font-size: 18px;
                font-weight: 600;
              }
              
              .events-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
              }
              
              .event-card {
                background: #f8f9fa;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #e9ecef;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              
              .event-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              }
              
              .event-image {
                height: 120px;
                overflow: hidden;
              }
              
              .event-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              
              .event-info {
                padding: 15px;
              }
              
              .event-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #333;
              }
              
              .event-date, .event-price {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
              }
              
              .event-stats {
                margin-bottom: 10px;
              }
              
              .event-stats .event-price {
                margin-bottom: 3px;
                font-size: 11px;
              }
              
              .view-event-btn {
                background: #25aae1;
                color: black;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 10px;
                width: 100%;
                transition: background 0.3s ease;
              }
              
              .view-event-btn:hover {
                background: #1a8abf;
              }
              
              .view-all-container {
                text-align: center;
                margin-top: 20px;
              }
              
              .view-all-btn {
                background: transparent;
                border: 2px solid #25aae1;
                color: #25aae1;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
              }
              
              .view-all-btn:hover {
                background: #25aae1;
                color: Black;
              }
              
              .empty-state {
                text-align: center;
                padding: 40px 20px;
                background: white;
                border-radius: 10px;
                margin-top: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              
              .empty-icon {
                font-size: 48px;
                color: #25aae1;
                margin-bottom: 20px;
              }
              
              .empty-state h4 {
                color: #333;
                margin-bottom: 10px;
              }
              
              .empty-state p {
                color: #666;
                margin-bottom: 20px;
              }
              
              .create-first-event-btn {
                background: #25aae1;
                color: black;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s ease;
              }
              
              .create-first-event-btn:hover {
                background: #1a8abf;
              }
              
              .data-note {
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                border: 1px solid #e9ecef;
              }
            `}</style>
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
