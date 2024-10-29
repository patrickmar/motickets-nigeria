import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import Card from "../Card";

type Props = {};

const AllTickets = (props: Props) => {
  const currency = process.env.REACT_APP_CURRENCY;
  const [endpoint, setEndpoint] = useState(`/eventspercurrency/${currency}`);
  const { data, loading } = useFetch(endpoint);
  console.log(setEndpoint);

  // const onTabChange = (tab: string) => {
  //   setEndpoint(
  //     tab === "This Week" ? `/eventspercurrency/${currency}` : `/weekly/events`
  //   );
  // };
  return <Card title="All Events" data={data?.data} loading={loading} />;
};

export default AllTickets;
