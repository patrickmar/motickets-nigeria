// Enhanced DetailsBanner with artistic design

import { useState, useEffect, Fragment, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import "./styles.scss";
import ContentWrapper from "../../components/ContentWrapper";
import Img from "../../components/LazyLoadImage";
import PosterFallback from "../../assets/images/no-poster.png";
import Tags from "../Tags";
import {
  convertHTMLCode,
  getCurrency,
  getCurrencyName,
  getTags,
} from "../../utils/functions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";
import SocialShareButtons from "../SocialShareButtons";

type Props = {
  id: any;
  data: any;
  loading: boolean;
  error?: any;
};

const DetailsBanner = ({ id, data, loading, error }: Props) => {
  const newData = data?.data[0];
  const imageURL = process.env.REACT_APP_IMAGEURL || "";
  const [selectedImage, setSelectedImage] = useState(
    newData ? newData?.imgs[0]?.img : ""
  );
  const [showVideoModal, setShowVideoModal] = useState(false);

  const enableSeat = newData?.enableseat;
  const [tickets, setTickets] = useState<any>([]);
  const [bookFees, setbookFees] = useState<any>([]);
  const [ticketsQty, setTicketsQty] = useState<any>([]);
  const [ticketsPrice, setTicketsPrice] = useState<any>([]);
  const navigate = useNavigate();

  // Check if event end date is past
  const isEventPast = () => {
    if (!newData?.to_date || newData.to_date === "") {
      const eventStartTime = moment(
        `${newData.from_date} ${newData.from_time}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const currentTime = moment();
      return currentTime.isAfter(eventStartTime.add(1, "hour"));
    }
    return moment(newData.to_date).isBefore(moment(), "day");
  };

  const getYouTubeThumbnail = (url: string) => {
    if (!url) return "";
    const videoId = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    )?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "";
  };

  useEffect(() => {
    if (newData) {
      setSelectedImage(newData?.imgs[0]?.img);
      setTickets(
        newData.ticketCategories.map((category: any) => ({
          price: category.price,
          discount_price: category.discount_price,
          event_id: category.event_id,
          id: category.id,
          name: category.name,
          booking_fee: category.booking_fee,
          qty: 0,
          issued_qty: category.quantity,
        }))
      );
      setTicketsQty(
        newData.ticketCategories.map((category: any) => ({
          qty: category.quantity,
        }))
      );
      setTicketsPrice(
        newData.ticketCategories.map((category: any) => ({
          pric: category.price,
        }))
      );
      setbookFees(
        newData.ticketCategories.map((category: any) => ({
          booking_fee: category.booking_fee,
        }))
      );
    }
  }, [data, newData]);

  const eventInfo = (newData: any) => {
    const options = [
      {
        name: "Venue",
        value: newData?.venue,
        icon: "📍",
      },
      {
        name: "Category",
        value: newData?.event_cat,
        icon: "🎯",
      },
      {
        name: "Duration",
        value: differenceInDays(newData) + " days",
        icon: "📅",
      },
    ];
    return options;
  };

  const dateInfo = (newData: any) => {
    const options = [
      {
        name: "Starts",
        value: moment(newData?.from_date).format("MMM D, YYYY"),
        icon: "🚀",
      },
      {
        name: "Ends",
        value: newData?.to_date
          ? moment(newData?.to_date).format("MMM D, YYYY")
          : "One day event",
        icon: "🎉",
      },
      {
        name: "Time",
        value: moment(newData?.from_date + " " + newData?.from_time).format(
          "hh:mm A"
        ),
        icon: "⏰",
      },
    ];
    return options;
  };

  const differenceInDays = (newData: any) => {
    const startDateMoment = newData?.from_date
      ? moment(newData?.from_date)
      : moment();
    const endDateMoment =
      newData?.to_date && newData?.to_date !== ""
        ? moment(newData?.to_date)
        : moment(newData?.from_date);
    return endDateMoment.diff(startDateMoment, "days") + 1;
  };

  const currency = getCurrency(newData);
  const currencyName = getCurrencyName(newData);
  const isButtonEnabled =
    tickets.some((item: any) => item.qty > 0) && !isEventPast();

  const increment = (index: number) => {
    if (isEventPast()) return;

    const updatedCategories = [...tickets];
    const updatedQty = [...ticketsQty];
    const updatedPrice = [...ticketsPrice];

    if (updatedPrice[index].pric == 0.0 && updatedCategories[index].qty >= 1) {
      updatedCategories[index].qty = 0;
      toast("🎟️ You can only get 1 free ticket per order");
    }
    if (updatedCategories[index].qty >= updatedQty[index].qty) {
      toast(
        `⚠️ Only ${updatedQty[index].qty} tickets remaining for ${updatedCategories[index].name}`
      );
    } else {
      updatedCategories[index].qty += 1;
      setTickets(updatedCategories);
    }
  };

  const decrement = (index: number) => {
    if (isEventPast()) return;

    const updatedCategories = [...tickets];
    if (updatedCategories[index].qty > 0) {
      updatedCategories[index].qty -= 1;
      setTickets(updatedCategories);
    }
  };

  const handleQuantity = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isEventPast()) return;

    const updatedCategories = [...tickets];
    const updatedQty = [...ticketsQty];
    updatedCategories[index].qty = Number(e.target.value);
    setTickets(updatedCategories);
  };

  const calculateTotalPrice = (category: any, index: number) => {
    const updatedCategories = [...tickets];
    const updatedBookFees = [...bookFees];
    const qty = category.qty > 0 ? category.qty : 1;
    const bookFee = updatedBookFees[index].booking_fee;
    const newBookFee = bookFee * qty;
    const newPrice = category.price * qty;
    updatedCategories[index].booking_fee = newBookFee;
    return newPrice.toFixed(2);
  };

  const goToCheckout = () => {
    if (isEventPast()) return;

    const { currency, title } = newData;
    navigate("/checkout", {
      state: { tickets: tickets, data: { currency, title } },
    });
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <Fragment>
              {/* Enhanced Background with Gradient Overlay */}
              <div className="backdrop-img">
                <Img src={imageURL + newData?.imgs[0]?.img} />
                <div className="gradient-overlay"></div>
              </div>

              <ContentWrapper>
                <div className="content">
                  {/* Left Column - Visual Content */}
                  <div className="left">
                    {/* Main Poster with Elegant Frame */}
                    <div className="poster-container">
                      {newData?.imgs[0]?.img ? (
                        <Img
                          className="posterImg"
                          src={imageURL + selectedImage}
                        />
                      ) : (
                        <Img className="posterImg" src={PosterFallback} />
                      )}
                      {/* Event Status Badge */}
                      {isEventPast() && (
                        <div className="event-status-badge past">
                          <span>Event Ended</span>
                        </div>
                      )}
                      {newData?.youtubeurl && !isEventPast() && (
                        <div className="event-status-badge video">
                          <button
                            onClick={() => setShowVideoModal(true)}
                            className="video-preview-btn"
                          >
                            🎬 Watch Trailer
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Gallery Section */}
                    <div className="gallery-section">
                      <h3 className="gallery-title">Event Gallery</h3>
                      <div className="gallery-grid">
                        {newData?.imgs
                          ?.slice(0, 4)
                          .map((item: any, i: number) => (
                            <div
                              key={i}
                              className={`gallery-item ${
                                selectedImage === item.img ? "active" : ""
                              }`}
                              onClick={() => setSelectedImage(item.img)}
                            >
                              <div className="image-frame">
                                <Img
                                  src={imageURL + item.img}
                                  alt={`${newData.title} ${i + 1}`}
                                />
                              </div>
                            </div>
                          ))}

                        {newData?.youtubeurl && (
                          <div
                            className="gallery-item video-thumbnail"
                            onClick={() => setShowVideoModal(true)}
                          >
                            <div className="image-frame">
                              <Img
                                src={getYouTubeThumbnail(newData.youtubeurl)}
                                alt={`${newData.title} video`}
                              />
                              <div className="video-overlay">
                                <div className="play-icon">
                                  <svg viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Content */}
                  <div className="right">
                    {/* Header Section */}
                    <div className="header-section">
                      <div className="title">{newData.title}</div>
                      <div className="subtitle">{newData.tagline}</div>
                      <Tags data={getTags(newData?.tags)} />
                    </div>

                    {/* Description Section */}
                    <div className="description-section">
                      <h3 className="section-title">
                        <span className="title-icon">📖</span>
                        About This Event
                      </h3>
                      <div className="description-content">
                        {convertHTMLCode(newData?.des)}
                      </div>
                    </div>

                    {/* Info Cards */}
                    <div className="info-cards">
                      <div className="info-card">
                        <h4 className="card-title">
                          <span className="card-icon">ℹ️</span>
                          Event Details
                        </h4>
                        <div className="card-content">
                          {eventInfo(newData).map(
                            (item: any, i: number) =>
                              item.value && (
                                <div key={i} className="info-row">
                                  <span className="info-icon">{item.icon}</span>
                                  <div className="info-text">
                                    <div className="info-label">
                                      {item.name}
                                    </div>
                                    <div className="info-value">
                                      {item.value}
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>

                      <div className="info-card">
                        <h4 className="card-title">
                          <span className="card-icon">📅</span>
                          Date & Time
                        </h4>
                        <div className="card-content">
                          {dateInfo(newData).map(
                            (item: any, i: number) =>
                              item.value && (
                                <div key={i} className="info-row">
                                  <span className="info-icon">{item.icon}</span>
                                  <div className="info-text">
                                    <div className="info-label">
                                      {item.name}
                                    </div>
                                    <div className="info-value">
                                      {item.value}
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Social Sharing */}
                    {!isEventPast() && (
                      <div className="social-section">
                        <h4 className="section-title">Share This Event</h4>
                        <SocialShareButtons eventData={newData} />
                      </div>
                    )}

                    {/* Tickets Section */}
                    <div className="tickets-section">
                      <div className="tickets-header">
                        <h2 className="tickets-title">🎟️ Get Your Tickets</h2>
                        {!isEventPast() && (
                          <div className="booking-fee-note">
                            * All prices include booking fees
                          </div>
                        )}
                      </div>

                      {isEventPast() ? (
                        <div className="event-ended-message">
                          <div className="ended-icon">❌</div>
                          <div className="ended-text">
                            <h3>This event has ended</h3>
                            <p>Thank you for your interest!</p>
                          </div>
                        </div>
                      ) : enableSeat === 0 ? (
                        <div className="event-unavailable-message">
                          <div className="unavailable-icon">🚫</div>
                          <div className="unavailable-text">
                            <h3>Event Unavailable</h3>
                            <p>
                              This event is no longer available for booking.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="tickets-list">
                          {tickets.map((item: any, index: number) => (
                            <div
                              key={index}
                              className={`ticket-item ${
                                item.issued_qty <= 0 ? "sold-out" : ""
                              }`}
                            >
                              <div className="ticket-info">
                                <h4 className="ticket-name">{item.name}</h4>
                                <div className="ticket-price">
                                  {item.price == 0 ? (
                                    <span className="free-badge">FREE</span>
                                  ) : (
                                    <NumericFormat
                                      value={item.price}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                      prefix={`${currency} `}
                                      decimalScale={2}
                                      fixedDecimalScale={true}
                                    />
                                  )}
                                  {item.booking_fee > 0 && (
                                    <span className="fee-note">
                                      + {currency}
                                      {Number(item.booking_fee).toFixed(2)} fee
                                    </span>
                                  )}
                                </div>
                                <div className="ticket-availability">
                                  {item.issued_qty <= 0 ? (
                                    <span className="sold-out-badge">
                                      Sold Out
                                    </span>
                                  ) : (
                                    <span className="available-text">
                                      {item.issued_qty} tickets left
                                    </span>
                                  )}
                                </div>
                              </div>

                              {item.issued_qty > 0 && (
                                <div className="ticket-controls">
                                  <div className="quantity-selector">
                                    <button
                                      type="button"
                                      onClick={() => decrement(index)}
                                      className="quantity-btn minus"
                                      disabled={item.qty === 0}
                                    >
                                      −
                                    </button>
                                    <input
                                      type="text"
                                      value={item.qty}
                                      onChange={(e) => handleQuantity(index, e)}
                                      className="quantity-input"
                                      readOnly={
                                        item.price === 0 && item.qty >= 1
                                      }
                                    />
                                    <button
                                      type="button"
                                      onClick={() => increment(index)}
                                      className="quantity-btn plus"
                                      disabled={
                                        (item.price === 0 && item.qty >= 1) ||
                                        item.qty >= item.issued_qty
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                  {item.qty > 0 && (
                                    <div className="ticket-subtotal">
                                      <NumericFormat
                                        value={calculateTotalPrice(item, index)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={`${currency} `}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Checkout Button */}
                      {!isEventPast() && enableSeat !== 0 && (
                        <div className="checkout-section">
                          <button
                            onClick={goToCheckout}
                            disabled={!isButtonEnabled}
                            className={`checkout-btn ${
                              !isButtonEnabled ? "disabled" : "enabled"
                            }`}
                          >
                            <span className="btn-text">
                              {isButtonEnabled
                                ? "Continue to Checkout"
                                : "Select Tickets"}
                            </span>
                            <span className="btn-icon">→</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ContentWrapper>
            </Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              {[1, 2, 3, 4, 5, 6, 7].map((item, i) => (
                <div key={i} className="row skeleton"></div>
              ))}
            </div>
          </ContentWrapper>
        </div>
      )}

      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title="Event Trailer"
      >
        <div className="video-container">
          <iframe
            className="video-iframe"
            src={`https://www.youtube.com/embed/${
              newData?.youtubeurl?.match(
                /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
              )?.[1]
            }`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default DetailsBanner;
