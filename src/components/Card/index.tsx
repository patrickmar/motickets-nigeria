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
  // const filteredData =  data.filter((item:any) =>
  // item.currency.includes('GBP')
  // );

  // console.log(filteredData);
  const SkItem = () => {
    return (
      <div className="skeletonItem mb-5">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="carousel">
        <ContentWrapper>
          {title && <div className="carouselTitle">{title}</div>}
          {!loading ? (
            <div className="cardItems">
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
                {data?.map((item: any, i: number) => {
                  const posterUrl = item?.imgs[0]?.img
                    ? imageURL + item.imgs[0].img
                    : PosterFallback;
                  return (
                    <div
                      key={i}
                      className="cardItem"
                      onClick={() => navigate(`/details/${item.slug}`)}
                    >
                      <div className="posterBlock">
                        <Img src={posterUrl} alt="anotherone" />
                        <Tags data={getTags(item?.tags).slice(0, 2)} />
                      </div>
                      <div className="textBlock">
                        <span className="title">{item.title}</span>
                        <p className="text-lg font-medium text-white">
                          <PriceSelection
                            ticketCategories={item.ticketCategories}
                            currency={currency as string}
                          />
                        </p>
                        <span className="date">
                          {moment(item.from_date).format("MMM D, YYYY.")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="loadingSkeleton">
                {<SkItem />}
                {<SkItem />}
                {<SkItem />}
                {<SkItem />}
                {<SkItem />}
              </div>
              <div className="loadingSkeleton my-3">
                {<SkItem />}
                {<SkItem />}
                {<SkItem />}
                {<SkItem />}
                {<SkItem />}
              </div>
            </>
          )}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Card;
