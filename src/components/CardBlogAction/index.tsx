import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import moment from "moment";
import Img from "../LazyLoadImage";
import PosterFallback from "../../assets/images/no-poster.png";
import { PriceSelection, getCurrency } from "../../utils/functions";
import { Link } from "react-router-dom";

export default function CardBlogAction() {
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(
    `/pasteventspercurrency/${currency}`
  );
  const { data, loading } = useFetch(endpoint); // Fetch data from the API
  const eventData = data?.data; // Ensure you access the correct array

  const imageURL = process.env.REACT_APP_IMAGEURL;

  return (
    <div className="bg-[#f9f9f9]">
      <h3 className="text-dark text-2xl p-12">Explore Events</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-12">
        {!loading
          ? eventData?.map((item: any, index: number) => {
              const posterUrl = item?.imgs[0]?.img
                ? imageURL + item.imgs[0].img
                : PosterFallback;

              return (
                <div
                  key={index}
                  className="flex flex-col rounded-lg bg-white text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white"
                >
                  <Link to={`/details/${item.slug}`}>
                    <Img
                      className="rounded-t-lg w-full h-48 object-cover"
                      src={posterUrl}
                      alt={item.title || "Event Image"}
                    />
                  </Link>
                  <div className="p-6">
                    <h5 className="mb-2 text-xl font-medium leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-lg font-medium text-dark">
                      <PriceSelection
                        ticketCategories={item.ticketCategories}
                        currency={getCurrency(item)}
                      />
                    </p>
                    <p className="text-base text-gray-600">
                      {moment(item.from_date).format("MMM D, YYYY")}
                    </p>
                    {/* <p className="mt-4 text-base text-gray-800">
                      {item.description || "No description available."}
                    </p> */}
                  </div>
                </div>
              );
            })
          : // Render skeletons during loading
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col rounded-lg bg-gray-300 dark:bg-gray-700"
              >
                <div className="h-48 bg-gray-400 dark:bg-gray-600 rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-400 rounded"></div>
                  <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
