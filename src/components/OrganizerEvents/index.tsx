import Carousel from "../../components/Carousel";
import useFetch from "../../hooks/useFetch";

type Props = {
  info: any;
};

const OtherOrganizerEvents = ({ info }: Props) => {
  const currency = process.env.REACT_APP_CURRENCY;
  const { data, loading, error } = useFetch(`/eventspercurrency/${currency}`);
  const newData = data?.data;
  const events = newData?.filter(
    (d: any) =>
      d?.submerchantId === info?.data[0]?.submerchantId &&
      d?.sn !== info?.data[0]?.sn
  );

  const title = "Other Events from Organizer";

  return <Carousel title={title} data={events} loading={loading} />;
};

export default OtherOrganizerEvents;
