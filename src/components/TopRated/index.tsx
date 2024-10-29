import React, { useState } from "react";

import Carousel from "../../components/Carousel";
import ContentWrapper from "../../components/ContentWrapper";
import SwitchTabs from "../../components/SwitchTabs";

import useFetch from "../../hooks/useFetch";

const TopRated = () => {
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(currency);
  //const { data, loading } = useFetch(`/${endpoint}/events`);
  const { data, loading } = useFetch(`/eventspercurrency/${endpoint}`);

  const onTabChange = (tab: string) => {
    // setEndpoint(tab === "This Week" ? "weekly" : "weekly");
    setEndpoint(tab === "This Week" ? endpoint : endpoint);
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">Top Rated</span>
        <SwitchTabs
          data={["This Week", "This Month"]}
          onTabChange={onTabChange}
        />
      </ContentWrapper>
      <Carousel data={data?.data.slice(3)} loading={loading} />
    </div>
  );
};

export default TopRated;
