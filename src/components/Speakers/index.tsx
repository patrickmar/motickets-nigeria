import { useEffect, useState } from "react";
import "./styles.scss";
import ContentWrapper from "../../components/ContentWrapper";
import Img from "../../components/LazyLoadImage";
import avatar from "../../assets/images/speakers/hassan.png";
import speaker1 from "../../assets/images/speakers/hassan.png";
import speaker2 from "../../assets/images/speakers/Hassan-U.png";
import speaker3 from "../../assets/images/speakers/kaphayat.jpg";
import speaker4 from "../../assets/images/speakers/kayode.png";

type Props = {
  data: any;
  loading?: boolean;
  title: string;
};

const Speakers = ({ title }: Props) => {
  const [fakeLoading, setfakeLoading] = useState(true);
  const dummyData = [
    {
      name: "Femi Johnson",
      role: "Lead Speaker",
      img: speaker1,
    },
    {
      name: "Brown Johnson",
      role: "Speaker",
      img: speaker2,
    },
    {
      name: "John James",
      role: "Cofounder MTC Group",
      img: speaker3,
    },
    {
      name: "Bode Thompson",
      role: "Speaker",
      img: speaker4,
    },
    {
      name: "Femi Fatade",
      role: "Speaker",
      img: speaker1,
    },
    {
      name: "Patrick Roy",
      role: "Speaker",
      img: speaker3,
    },
  ];

  const skeleton = () => {
    return (
      <div className="skItem">
        <div className="circle skeleton"></div>
        <div className="row skeleton"></div>
        <div className="row2 skeleton"></div>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setfakeLoading(false);
    }, 7000 * 1);
  }, []);

  return (
    <div className="castSection">
      <ContentWrapper>
        <div className="sectionHeading">Event {title}</div>
        {!fakeLoading ? (
          <div className="listItems">
            {dummyData?.map((item: any, i: number) => {
              let imgUrl = item.img ? item.img : avatar;
              return (
                <div key={i} className="listItem">
                  <div className="profileImg">
                    <Img src={imgUrl} />
                  </div>
                  <div className="name">{item.name}</div>
                  <div className="character">{item.role}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="castSkeleton">
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Speakers;
