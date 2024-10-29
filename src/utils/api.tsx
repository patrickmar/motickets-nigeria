import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASEURL;
const TOKEN = "";

const headers = {
  Authorization: "bearer " + TOKEN,
};

export const fetchDataFromApi = async (url: string, params?: any) => {
  try {
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    //console.log(err);
    return err;
  }
};

export const postDataFromApi = async (url: string, params?: any) => {
  try {
    const { data } = await axios.post(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    //console.log(err);
    return err;
  }
};
