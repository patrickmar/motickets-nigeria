import { useNavigate } from "react-router-dom";
import ContentWrapper from "../ContentWrapper";
import Img from "../LazyLoadImage";
import PosterFallback from "../../assets/images/no-poster.png";
import "./styles.scss";
import moment from "moment";
import Tags from "../Tags";
import { PriceSelection, getCurrency, getTags } from "../../utils/functions";

type Props = {
  data: any;
  loading: boolean;
  title?: string;
};

const Card = ({ data, loading, title }: Props) => {
  const imageURL = process.env.REACT_APP_IMAGEURL;
  const navigate = useNavigate();

  const currency = data && getCurrency(data[0]);

  return (
    <div className="bg-[#f9f9f9]  py-10">
      {title && <h3 className="text-dark text-2xl p-12  ">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-12 ">
        {!loading
          ? data?.map((item: any, index: number) => {
              const posterUrl = item?.imgs[0]?.img
                ? imageURL + item.imgs[0].img
                : PosterFallback;

              return (
                <div
                  key={index}
                  className="flex flex-col rounded-lg bg-white text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white transition-opacity"
                  onClick={() => navigate(`/details/${item.slug}`)}
                >
                  <Img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={posterUrl}
                    alt={item.title || "Event Image"}
                  />
                  <div className="p-6">
                    <h5 className="mb-2 text-xl font-medium leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-lg font-medium text-dark">
                      <PriceSelection
                        ticketCategories={item.ticketCategories}
                        currency={currency as string}
                      />
                    </p>
                    <p className="text-base text-gray-600">
                      {moment(item.from_date).format("MMM D, YYYY")}
                    </p>
                  </div>
                </div>
              );
            })
          : [...Array(6)].map((_, i) => (
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
};

export default Card;
