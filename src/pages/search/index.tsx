import { useState } from "react";
import Card from "../../components/Card";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";

type Props = {};

const Search = (props: Props) => {
  const currency = process.env.REACT_APP_CURRENCY;
  const { query } = useParams();
  const [endpoint, setEndpoint] = useState(
    `/event/search/${query}&${currency}`
  );
  const { data, loading } = useFetch(endpoint);

  // const filteredData=data.filter((item:any) =>
  // item.currency.includes('GBP')

  // const filteredData = data.filter((item:any) =>
  // item.currency.includes('GBP')
  // );
  // console.log(filteredData);

  // const res= (data.filter(function(item){
  //   return item.type == "ar";
  // }));
  // var filtered = data.filter(a => a.currency == "GBP");

  // const filteredData = data.filter((item:any) =>
  // item.currency.includes('GBP')
  // );
  //console.log(filteredData);

  const onTabChange = (tab: string) => {
    setEndpoint(
      tab === "This Week" ? `/eventspercurrency/${currency}` : `/weekly/events`
    );
  };
  console.log(onTabChange);
  return (
    <Card
      title={`Search Results for ${query}`}
      data={data?.data}
      loading={loading}
    />
  );
};

export default Search;
