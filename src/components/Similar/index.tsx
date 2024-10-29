import Carousel from "../../components/Carousel";
import useFetch from "../../hooks/useFetch";

type Props = {
  mediaType?: string;
  id?: string;
};

const Similar = ({ mediaType, id }: Props) => {
  const currency = process.env.REACT_APP_CURRENCY;
  const { data, loading } = useFetch(`/eventspercurrency/${currency}`);
  const title = "Similar Events";

  return <Carousel title={title} data={data?.data} loading={loading} />;
};

export default Similar;
