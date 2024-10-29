import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/api";
const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError("");

    fetchDataFromApi(url)
      .then((res: any) => {
        // setLoading(false);
        // setData(res?.name === "AxiosError" ? null : res);
        setTimeout(() => {
          setLoading(false);
          setData(res?.name === "AxiosError" ? null : res);
        }, 3000 * 1);
      })
      .catch((err: any) => {
        
        setLoading(false);
        setError("Something went wrong!");
      });
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
