import { useParams } from "react-router-dom";
import DetailsBanner from "../../components/DetailsBanner";
import useFetch from "../../hooks/useFetch";
import moment from "moment";

type Props = {};

const Details = (props: Props) => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/event_slug/${id}`);
  console.log(data);

  return (
    <div className="">
      <DetailsBanner id={id} data={data} loading={loading} error={error} />
    </div>
  );
};
export default Details;
