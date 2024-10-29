import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

type Props = {};

const PublicRoute = (props: Props) => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicRoute;
