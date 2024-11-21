import { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "../ContentWrapper";
import Img from "../LazyLoadImage";
import PosterFallback from "../../assets/images/no-poster.png";
import "./style.scss";
import moment from "moment";
import Tags from "../Tags";
import { PriceSelection, getCurrency, getTags } from "../../utils/functions";

type Props = {
  data: any;
  loading: boolean;
  title?: string;
};

const Carousel = ({ data, loading, title }: Props) => {
  const carouselContainer = useRef({});
  const imageURL = process.env.REACT_APP_IMAGEURL;
  const navigate = useNavigate();

  const navigation = (dir: string) => {
    const container = carouselContainer.current as any;

    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const currency = data && getCurrency(data[0]);

  const SkItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel h-screen overflow-hidden">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />
        {!loading ? (
          <div className="carouselItems" ref={carouselContainer as any}>
            {data?.map((item: any, i: number) => {
              const posterUrl = item?.imgs[0]?.img
                ? imageURL + item.imgs[0].img
                : PosterFallback;
              return (
                <div
                  key={i}
                  className="carouselItem"
                  onClick={() => navigate(`/details/${item.slug}`)}
                >
                  <div className="posterBlock">
                    <Img src={posterUrl} />
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
        ) : (
          <div className="loadingSkeleton">
            {<SkItem />}
            {<SkItem />}
            {<SkItem />}
            {<SkItem />}
            {<SkItem />}
            {/* {skItem()}
            {skItem()}
            {skItem()}
            {skItem()} */}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;
