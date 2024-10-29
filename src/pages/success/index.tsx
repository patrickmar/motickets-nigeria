import { useLocation } from "react-router-dom";
import SuccessComponent from "../../components/SuccessComponent";

type Props = {};

const Success = (props: Props) => {
  const location = useLocation();
  const stripeData = location?.state?.stripeData;
  const tickets = location?.state?.tickets;
  const data = location?.state?.data;
  const ticketData = location?.state?.ticketData;

  return (
    <SuccessComponent
      stripeData={stripeData}
      tickets={tickets}
      data={data}
      ticketData={ticketData}

      // vat={vat}
      // totalAmount={totalAmount}
      // subTotal={subtotal}
    />
  );
};

export default Success;
