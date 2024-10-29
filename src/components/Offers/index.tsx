import { useState, useRef } from "react";
// import Carousel from "../Carousel";
import ContentWrapper from "../ContentWrapper";
// import SwitchTabs from "../SwitchTabs";
import useFetch from "../../hooks/useFetch";
import Img from "../LazyLoadImage";
import PosterFallback from "../../assets/images/no-poster.png";
import "./style.scss";
// import moment from "moment";
// import Tags from "../Tags";
// import { PriceSelection, getCurrency, getTags } from "../../utils/functions";
import { offers } from "../../constant";
// import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

//const HashLink = require('react-router-hash-link');
// const imageURL = process.env.REACT_APP_BASEURL;

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

const Offers = () => {
  const carouselContainer = useRef({});
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(currency);
  console.log(setEndpoint);
  //const { data, loading } = useFetch(`/${endpoint}/events`);
  const { loading } = useFetch(`/eventspercurrency/${endpoint}`);

  // const onTabChange = (tab: string) => {
  //   // setEndpoint(tab === "Weekly" ? "weekly" : "monthly");
  //   setEndpoint(tab === "This Week" ? endpoint : endpoint);
  // };

  //const OffersData = data?.data.slice(0).reverse(); //slice(-5)

  // const navigate= useNavigate();
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">What we offer</span>
        {/* <SwitchTabs
          data={["This Week", "This Month"]}
          onTabChange={onTabChange}
        /> */}
      </ContentWrapper>
      <div className="carousel">
        <ContentWrapper>
          {/* {title && <div className="carouselTitle">{title}</div>} */}
          {/* <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        /> */}
          {!loading ? (
            <div className="carouselItems" ref={carouselContainer as any}>
              {offers?.map((item: any, i: number) => {
                const posterUrl = item?.imgs ? item?.imgs : PosterFallback;

                return (
                  <div
                    key={i}
                    className="carouselItem"

                    // onClick={() => navigate(`${item.url}`)}
                  >
                    <HashLink smooth to={item.url}>
                      <div className="posterBlock">
                        <Img src={posterUrl} />
                        {/* <Tags data={getTags(item?.tags).slice(0, 2)} /> */}
                      </div>
                    </HashLink>
                    {/* <div className="textBlock">
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
                  </div> */}
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
    </div>
  );
};

export default Offers;
