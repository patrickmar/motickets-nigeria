import HeroBanner from "../../components/HeroBanner";
import PastEvent from "../../components/PastEvents";
// import TopRated from "../../components/TopRated";
import Trending from "../../components/Trending";
import Offers from "../../components/Offers";
import { ToastContainer } from "react-toastify";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="">
      <HeroBanner />
      <Offers />
      <Trending />
      <PastEvent />
      {/* <TopRated /> */}
      <ToastContainer />
    </div>
  );
};

export default Home;