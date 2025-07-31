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
  const navigate = useNavigate();

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

      setbookFees(
        newData.ticketCategories.map((category: any) => ({
          booking_fee: category.booking_fee,
        }))
      );
    }
  }, [data, newData]);

  // event info
  const eventInfo = (newData: any) => {
    const options = [
      {
        name: "Venue",
        value: newData?.venue,
      },
      {
        name: "Category",
        value: newData?.event_cat,
      },
      {
        name: "Days",
        value: differenceInDays(newData),
      },
    ];
    return options;
  };

  const dateInfo = (newData: any) => {
    const options = [
      {
        name: "Start Date",
        value: moment(newData?.from_date).format("MMM D, YYYY."),
      },
      {
        name: "End Date",
        value: newData?.to_date
          ? moment(newData?.to_date).format("MMM D, YYYY.")
          : "",
      },
      {
        name: "Time",
        value: moment(newData?.from_date + " " + newData?.from_time).format(
          "hh:mmA"
        ),
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
  const isButtonEnabled = tickets.some((item: any) => item.qty > 0);

  const increment = (index: number) => {
    const updatedCategories = [...tickets];
    const updatedQty = [...ticketsQty];

    if (updatedCategories[index].qty >= updatedQty[index].qty) {
      toast(
        "You can not buy more than the remaining tickets ( " +
          updatedQty[index].qty +
          " ), kindly buy another ticket type"
      );
    } else {
      updatedCategories[index].qty += 1;
      setTickets(updatedCategories);
    }
  };

  const decrement = (index: number) => {
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
    return newPrice.toFixed(2); // Ensure the price is fixed to 2 decimal places
  };

  const goToCheckout = () => {
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
              <div className="backdrop-img">
                <Img src={imageURL + newData?.imgs[0]?.img} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {newData?.imgs[0]?.img ? (
                      <Img
                        className="posterImg"
                        src={imageURL + selectedImage}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}

                    {/* Responsive Gallery Section */}
                    <div className="w-full my-6 mx-auto">
                      <h3 className="text-xl font-bold text-white mb-4 lg:hidden">
                        Gallery
                      </h3>
                      <div className="flex flex-wrap gap-3 lg:gap-4 justify-center lg:justify-start">
                        {/* Image Thumbnails */}
                        {newData?.imgs
                          ?.slice(0, 4)
                          .map((item: any, i: number) => (
                            <button
                              key={i}
                              className={`group relative w-[calc(50%-6px)] sm:w-[calc(33%-8px)] md:w-[calc(25%-12px)] lg:w-24 h-24 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                              type="button"
                              onClick={() => setSelectedImage(item.img)}
                            >
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 z-10"></div>
                              <Img
                                className="object-cover w-full h-full"
                                alt={`${newData.title} ${item.sn}`}
                                src={imageURL + item.img}
                              />
                              <div
                                className={`absolute inset-0 ring-2 ring-offset-2 transition-all duration-300 ${
                                  selectedImage === item.img
                                    ? "ring-red-500 opacity-100"
                                    : "ring-transparent opacity-0"
                                }`}
                              ></div>
                            </button>
                          ))}

                        {/* YouTube Thumbnail */}
                        {newData?.youtubeurl && (
                          <button
                            className={`group relative w-[calc(50%-6px)] sm:w-[calc(33%-8px)] md:w-[calc(25%-12px)] lg:w-24 h-24 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                            type="button"
                            onClick={() => setShowVideoModal(true)}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 z-10 flex items-center justify-center">
                              <div className="w-12 h-12 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="white"
                                  className="w-6 h-6 ml-1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <Img
                              className="object-cover w-full h-full"
                              alt={`${newData.title} video preview`}
                              src={getYouTubeThumbnail(newData.youtubeurl)}
                            />
                            <span className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white bg-black bg-opacity-60 px-2 py-1 rounded truncate">
                              Video Preview
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="right">
                    <div className="title">{`${newData.title}`}</div>
                    <div className="subtitle">{newData.tagline}</div>
                    <Tags data={getTags(newData?.tags)} />
                    <div className="overview">
                      <div className="heading">Description</div>
                      <div className="description">
                        {convertHTMLCode(newData?.des)}
                      </div>
                    </div>

                    <div className="info">
                      {eventInfo(newData).map((item: any, i: number) => {
                        return (
                          item.value != null &&
                          item.value !== "" && (
                            <div className="infoItem" key={i}>
                              <span className="text bold">{item.name}: </span>
                              <span className="text">{item.value}</span>
                            </div>
                          )
                        );
                      })}
                    </div>

                    <div className="info">
                      {dateInfo(newData).map((item: any, i: number) => {
                        return (
                          item.value != null &&
                          item.value !== "" && (
                            <div className="infoItem" key={i}>
                              <span className="text bold">{item.name}: </span>
                              <span className="text">{item.value}</span>
                            </div>
                          )
                        );
                      })}
                    </div>

                    <div className="pointer-events-auto">
                      <div className="flex h-full flex-col overflow-y-scroll shadow-xl">
                        <div className="flex-1 overflow-y-auto py-6">
                          <div className="flex items-start justify-between">
                            <h2
                              className="text-lg font-medium text-white"
                              id="slide-over-title"
                            >
                              Admission
                            </h2>
                          </div>
                          <span className="text-sm font-small text-red-600">
                            *includes booking fee
                          </span>
                          <div className="mt-8">
                            <div className="flow-root">
                              {enableSeat === 0 ? (
                                <span className="flex items-center justify-center text-white">
                                  Event is no longer available.
                                </span>
                              ) : (
                                <ul
                                  role="list"
                                  className="-my-6 divide-y divide-gray-200"
                                >
                                  {tickets.map((item: any, index: number) => (
                                    <li key={index} className="flex py-3">
                                      <div className="flex flex-1 flex-col">
                                        <div>
                                          <div className="flex items-center text-base font-medium text-white">
                                            <h3 className="w-28">
                                              {item.name}
                                            </h3>
                                            {item.issued_qty <= 0 ? (
                                              <div className="relative flex items-center mx-auto max-w-[8rem]">
                                                <button
                                                  type="button"
                                                  className="relative md:text-sm text-xs bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:border-gray-600 hover:bg-black-100 border border-gray-200 rounded-s-lg rounded-e-lg px-5 py-2 focus:ring-gray-100 dark:focus:ring-gray-700 focus:outline-none"
                                                >
                                                  Sold Out
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="relative flex items-center mx-auto max-w-[8rem]">
                                                <button
                                                  type="button"
                                                  id="decrement-button"
                                                  onClick={() =>
                                                    decrement(index)
                                                  }
                                                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-red-700 border border-gray-200 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:outline-none"
                                                >
                                                  <svg
                                                    className="w-3 h-3 text-gray-900 dark:text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 18 2"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M1 1h16"
                                                    />
                                                  </svg>
                                                </button>
                                                <input
                                                  type="text"
                                                  id="quantity"
                                                  value={item.qty}
                                                  className="border bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-red-600 focus:border-red-600 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-600 dark:focus:border-red-600"
                                                  onChange={(e) =>
                                                    handleQuantity(index, e)
                                                  }
                                                />
                                                <button
                                                  type="button"
                                                  id="increment-button"
                                                  onClick={() =>
                                                    increment(index)
                                                  }
                                                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-100 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:outline-none"
                                                >
                                                  <svg
                                                    className="w-3 h-3 text-gray-900 dark:text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 18 18"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M9 1v16M1 9h16"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                            )}
                                            <p className="ml-8 w-[120px]">
                                              <NumericFormat
                                                value={calculateTotalPrice(
                                                  item,
                                                  index
                                                )}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                prefix={`${currency}`}
                                                decimalScale={2} // Ensure 2 decimal places
                                                fixedDecimalScale={true} // Always show 2 decimal places
                                              />
                                              {item.booking_fee > 0 && (
                                                <span className="text-xs italic font-small text-red-600">
                                                  {" "}
                                                  +{" "}
                                                  <NumericFormat
                                                    value={Number(
                                                      item.booking_fee
                                                    ).toFixed(2)}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={`${currency}`}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                  />{" "}
                                                  booking fee
                                                </span>
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 py-6">
                          <div className="mt-6">
                            <button
                              onClick={goToCheckout}
                              disabled={!isButtonEnabled}
                              className={`${
                                !isButtonEnabled ? "disabled" : ""
                              } flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700`}
                            >
                              Buy Tickets
                            </button>
                          </div>
                        </div>
                      </div>
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
        title="Video Preview"
      >
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg w-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
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
