import { useLocation } from "react-router-dom";
import SuccessComponent from "../../components/SuccessComponent";

type Props = {};

const Success = (props: Props) => {
  const location = useLocation();
  const stripeData = location?.state?.stripeData;
  const tickets = location?.state?.tickets;
  const data = location?.state?.data;
  const totalAmount = location?.state?.totalAmount;
  const totalbookingFee = location?.state?.totalbookingFee;
  const vat = location?.state?.vat;
  const subtotal = location?.state?.subtotal;
  const reference = location?.state?.reference;
  const formData = location?.state?.formData;
  const payValidated = location?.state?.payValidated;
  return (
    <SuccessComponent
      
      tickets={tickets}
      data={data}
      totalbookingFee={totalbookingFee}
      vat={vat}
      totalAmount={totalAmount}
      subTotal={subtotal}
      reference={reference}
      formData={formData}
      payValidated={payValidated}
      // vat={vat}
      
      // subTotal={subtotal}
    />
  );
};

export default Success;
