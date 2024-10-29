import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ContentWrapper = ({ children }: Props) => {
  return <div className="contentWrapper">{children}</div>;
};

export default ContentWrapper;
