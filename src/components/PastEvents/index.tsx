import { useState } from "react";
import Carousel from "../Carousel";
import ContentWrapper from "../ContentWrapper";
import SwitchTabs from "../SwitchTabs";
import useFetch from "../../hooks/useFetch";

const PastEvent = () => {
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(
    `/pasteventspercurrency/${currency}`
  );
  //const { data, loading } = useFetch(`/eventspercategory/${endpoint}`);
  const { data, loading } = useFetch(endpoint);
  console.log(data);
  const onTabChange = (tab: string) => {
    // setEndpoint(tab === "Weekly" ? "weekly" : "monthly");
    setEndpoint(tab === "This Week" ? endpoint : endpoint);
  };

  //const PastEventData = data?.data.slice(0).reverse(); //slice(-5)

  return (
    <div className="carouselSection  h-screen overflow-hidden">
      <ContentWrapper>
        {/* <span className="carouselTitle">Past Events</span> */}
        <SwitchTabs
          data={["This Week", "This Month"]}
          onTabChange={onTabChange}
        />
      </ContentWrapper>
      <Carousel data={data?.data} loading={loading} />
    </div>
  );
};

export default PastEvent;
