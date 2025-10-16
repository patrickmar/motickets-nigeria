import { useState, ReactNode } from "react";
import useFetch from "../../hooks/useFetch";
import moment from "moment";
import Img from "../LazyLoadImage";
import PosterFallback from "../../assets/images/no-poster.png";
import { PriceSelection, getCurrency } from "../../utils/functions";
import { Link } from "react-router-dom";

interface EventItem {
  slug: string;
  title: string;
  tagline?: string;
  event_cat?: string;
  venue?: string;
  from_date: string;
  from_time: string;
  imgs: Array<{ img: string }>;
  ticketCategories: any[];
}

interface FormattedDate {
  day: string;
  month: string;
  year: string;
  full: string;
}

export default function CardBlogAction() {
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(
    `/pasteventspercurrency/${currency}`
  );
  const { data, loading } = useFetch(endpoint);
  const eventData = data?.data as EventItem[];
  const imageURL = process.env.REACT_APP_IMAGEURL;

  // Format date with visual appeal
  const formatEventDate = (date: string): FormattedDate => {
    return {
      day: moment(date).format("DD"),
      month: moment(date).format("MMM"),
      year: moment(date).format("YYYY"),
      full: moment(date).format("MMM D, YYYY"),
    };
  };

  // Helper function to check if price is free
  const isFreeEvent = (priceInfo: ReactNode): boolean => {
    if (typeof priceInfo === "string") {
      return priceInfo.toLowerCase().includes("free");
    }

    if (priceInfo && typeof priceInfo === "object" && "props" in priceInfo) {
      const priceText =
        priceInfo.props.children?.toString().toLowerCase() || "";
      return priceText.includes("free");
    }

    return false;
  };

  // Helper to get price text for free event check
  const getPriceText = (priceInfo: ReactNode): string => {
    if (typeof priceInfo === "string") {
      return priceInfo;
    }

    if (priceInfo && typeof priceInfo === "object" && "props" in priceInfo) {
      return priceInfo.props.children?.toString() || "";
    }

    return "";
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
      {/* Header Section */}
      <div className="text-center mb-12 px-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#25aae1] to-gray-500 bg-clip-text text-transparent mb-4">
          Relive Past Events
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
          Take a look back at the amazing events we've hosted. Missed them? Stay
          tuned for future experiences!
        </p>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!loading
            ? eventData?.map((item: EventItem, index: number) => {
                const posterUrl = item?.imgs[0]?.img
                  ? imageURL + item.imgs[0].img
                  : PosterFallback;

                const formattedDate = formatEventDate(item.from_date);
                const priceInfo = (
                  <PriceSelection
                    ticketCategories={item.ticketCategories}
                    currency={getCurrency(item)}
                  />
                );

                const priceText = getPriceText(priceInfo);
                const isFree = isFreeEvent(priceInfo);

                return (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {/* Past Event Badge */}
                    <div className="absolute top-4 left-4 z-20 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-95 shadow-lg">
                      Past Event
                    </div>

                    {/* Image Container */}
                    <Link
                      to={`/details/${item.slug}`}
                      className="block relative overflow-hidden"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Img
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale-50 group-hover:grayscale-0"
                          src={posterUrl}
                          alt={item.title || "Event Image"}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                        {/* Date Badge */}
                        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-3 text-center min-w-16 transform group-hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-600">
                          <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                            {formattedDate.day}
                          </div>
                          <div className="text-xs text-[#25aae1] font-semibold uppercase">
                            {formattedDate.month}
                          </div>
                        </div>

                        {/* View Recap Button */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors duration-300 shadow-lg flex items-center gap-2 border border-gray-200">
                            View Recap
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Category Tag */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-[#25aae1] bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                          {item.event_cat || "Event"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.venue || "Venue TBA"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#25aae1] transition-colors duration-300">
                        <Link
                          to={`/details/${item.slug}`}
                          className="hover:no-underline"
                        >
                          {item.title}
                        </Link>
                      </h3>

                      {/* Description Preview */}
                      {item.tagline && (
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 line-clamp-2">
                          {item.tagline}
                        </p>
                      )}

                      {/* Price Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {priceInfo}
                          </div>
                          {isFree && (
                            <span className="text-xs text-[#25aae1] font-medium">
                              Was Free
                            </span>
                          )}
                        </div>

                        {/* View Details Button */}
                        <Link
                          to={`/details/${item.slug}`}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:from-gray-600 hover:to-gray-500"
                        >
                          View Details
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {moment(item.from_date + " " + item.from_time).format(
                            "hh:mm A"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {item.venue ? item.venue.split(",")[0] : "Online"}
                        </div>
                      </div>

                      {/* Past Event Note */}
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>This event has ended</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-400/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                  </div>
                );
              })
            : // Enhanced Loading Skeletons
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                    </div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl w-32"></div>
                    </div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State for Past Events */}
        {!loading && (!eventData || eventData.length === 0) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Past Events Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-300 mb-6">
              Check out our upcoming events for future experiences!
            </p>
            <Link
              to="/events"
              className="bg-gradient-to-r from-[#25aae1] to-[#1e8fc5] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 hover:from-[#1e8fc5] hover:to-[#25aae1]"
            >
              View Upcoming Events
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
