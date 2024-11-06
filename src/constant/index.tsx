const imgurl = process.env.REACT_APP_BASEURL;

export const currencies = [
  // {
  //   name: "NGN",
  //   value: "₦",
  // },
  // {
  //   name: "USD",
  //   value: "$",
  // },
  // {
  //   name: "EUR",
  //   value: "€",
  // },
  {
    name: "NGN",
    value: "₦",
  },
];

export const countries = [
  {
    name: "Nigeria",
    url: "https://motickets.co.uk",
    code: "NG",
  },
  // {
  //   name: "United States",
  //   url: "https://motickets.co",
  //   code: "US",
  // },
  // {
  //   name: "Nigeria",
  //   url: "https://motickets.ng",
  //   code: "NG",
  // },
  // {
  //   name: "Canada",
  //   url: "https://motickets.co",
  //   code: "CA",
  // },
  // {
  //   name: "Ghana",
  //   url: "https://motickets.co",
  //   code: "GH",
  // },
];

export const guests = [
  {
    name: "Find Events",
    url: "events",
  },
  // {
  //   name: "Join a Community",
  //   url: "",
  // },
  // {
  //   name: "Info Hub",
  //   url: "",
  // },
];

export const hosts = [
  {
    name: "Organisers",
    url: "/organisers",
  },
  // {
  //   name: 'MoLoyal Agent App',
  //   url: 'https://play.google.com/store/apps/details?id=com.avantecs.moloyal',
  // },
  {
    name: "MoTickets Agent APK",
    url: "../MoTickets_Agent_App.apk",
  },
  {
    name: "Agent Web App",
    url: "https://motickets-agent-web.netlify.app",
  },

  {
    name: "Help",
    url: "/faq",
  },
];

export const QuillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

export const company = [
  {
    name: "Corporate Philosophy",
    url: "corporate-philosophy",
  },
  {
    name: "Corporate Profile",
    url: "corporate-profile",
  },
  // {
  //   name: "Our Partners",
  //   url: "",
  // },
  {
    name: "Terms of Service",
    url: "/terms",
  },
  {
    name: "Contact Us",
    url: "/contact-us",
  },
];

export const offers = [
  {
    title: "test title",
    url: "/organisers#create",
    imgs: `${imgurl}/offer_images/1.png`,
  },
  {
    title: "test titl",
    url: "/organisers#flexible",
    imgs: `${imgurl}/offer_images/2.png`,
  },
  {
    title: "test title",
    url: "/organisers#reward",
    imgs: `${imgurl}/offer_images/3.png`,
  },
  {
    title: "test title",
    url: "/organisers#analytics",
    imgs: `${imgurl}/offer_images/4.png`,
  },
  {
    title: "test title",
    url: "/organisers#moticketsapp",
    imgs: `${imgurl}/offer_images/5.png`,
  },
];
