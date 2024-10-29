import { currencies } from "../constant";

const defaultCurrency = process.env.REACT_APP_CURRENCY;
const defaultCurrencyCode = process.env.REACT_APP_CURRENCYCODE;


export const getTags = (tags: string) => {
  return tags.split(", ");
};

export const convertHTMLCode = (description: string) => {
  return <div dangerouslySetInnerHTML={{ __html: description }} />;
};

export const getCurrency = (data: any) => {
  const findCurrency =
    data && currencies.find((item) => item.name === data?.currency)?.value;
  const currency = findCurrency ? findCurrency : defaultCurrency;
  return currency;
};
export const getCurrencyCode = (data: any) => {
  const findCurrency =
    data && currencies.find((item) => item.name === data?.currency)?.name;
  const currency = findCurrency ? findCurrency : defaultCurrency;
  return currency;
};


export const getCurrencyName = (data: any) => {
  const findCurrency =
    data && currencies.find((item) => item.name === data?.currency)?.name;
  const currency = findCurrency ? findCurrency : defaultCurrencyCode;
  return currency;
};

type Props = {
  ticketCategories: Array<any>;
  currency: string;
};

export const PriceSelection = ({ ticketCategories, currency }: Props) => {
  const prices = ticketCategories.map((category) => category.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  return (
    <span>
      {" "}
      {}
      {lowestPrice === highestPrice
        ? currency + lowestPrice
        : currency + lowestPrice + " - " + currency + highestPrice}
    </span>
  );
};