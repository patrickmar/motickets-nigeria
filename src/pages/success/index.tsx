import { useLocation } from "react-router-dom";
import SuccessComponent from "../../components/SuccessComponent";

type Props = {};

const Success = (props: Props) => {
  const location = useLocation();
  const tickets = location?.state?.tickets;
  const data = location?.state?.data;
  const ticketData = location?.state?.ticketData;
  const paystackData = location?.state?.paystackData; // Extract paystackData

  return (
    <SuccessComponent
      tickets={tickets}
      data={data}
      ticketData={ticketData}
      paystackData={paystackData}
    />
  );
};

export default Success;
