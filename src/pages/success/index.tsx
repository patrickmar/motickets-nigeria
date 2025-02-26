import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SuccessComponent from "../../components/SuccessComponent";

const Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [tickets, setTickets] = useState(location?.state?.tickets);
  const [data, setData] = useState(location?.state?.data);
  const [ticketData, setTicketData] = useState(location?.state?.ticketData);
  const [paystackData, setPaystackData] = useState(
    location?.state?.paystackData || {
      reference: searchParams.get("reference"),
    }
  );

  useEffect(() => {
    if (!paystackData?.reference) {
      console.error("Missing payment reference.");
    }
  }, [paystackData]);

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
