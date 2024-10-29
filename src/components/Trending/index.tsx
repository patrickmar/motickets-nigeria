import { useState } from "react";

import Carousel from "../../components/Carousel";
import ContentWrapper from "../../components/ContentWrapper";
import SwitchTabs from "../SwitchTabs";

import useFetch from "../../hooks/useFetch";

const Trending = () => {
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(`/eventspercurrency/${currency}`);
  //const { data, loading } = useFetch(`/eventspercategory/${endpoint}`);
  const { data, loading } = useFetch(endpoint);
console.log(data);
  // const onTabChange = (tab: string) => {
  //   setEndpoint(tab === "Week" ? "trending" : "trending");
  // };
  const onTabChange = (tab: string) => {
    setEndpoint(
      // tab === "This Week"
      //   ? `/eventspercurrency/${currency}`
      //   : `/eventspercategory/trending`

      tab === "This Week"
      ? `/eventspercurrency/${currency}`
      : `/eventspercurrency/${currency}`
    );
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">Trending</span>
        <SwitchTabs
          data={["This Week", "This Month"]}
          onTabChange={onTabChange}
        />
      </ContentWrapper>
      <Carousel data={data?.data} loading={loading} />
    </div>
  );
};

export default Trending;
