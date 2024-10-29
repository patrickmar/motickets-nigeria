import { useEffect, useState } from "react";
import { postDataFromApi } from "../utils/api";
const usePost= (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError("");

    postDataFromApi(url)
      .then((res: any) => {
        // setLoading(false);
        // setData(res?.name === "AxiosError" ? null : res);
        setTimeout(() => {
          setLoading(false);
          setData(res?.name === "AxiosError" ? null : res);
        }, 5000 * 1);
      })
      .catch((err: any) => {
        //console.log(err);
        setLoading(false);
        setError("Something went wrong!");
      });
  }, [url]);

  return { data, loading, error };
};

export default usePost;
