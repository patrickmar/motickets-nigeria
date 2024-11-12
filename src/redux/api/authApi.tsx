import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";
import {
  setUser,
  setIsAuthenticated,
  setLoading,
} from "../../features/userSlice";

interface User {
  id: string;
  email: string;
  image: string | null;
  submerchantId: string | null;
  fullname: string;
  update_flag: string;
  branchId: string;
  accountNo: string;
  city: string | null;
  state: string | null;
  accountName: string;
  dateOfBirth: string | null;
  gender: string | null;
  bank: string;
  bankcode: string;
  bvn: string;
  message: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  date: string;
  dateCreated: string;
  phone: string | null;
  country: string; // Make sure 'country' exists in the response
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASEURL}/eventhost`,
  }),
  endpoints: (builder) => ({
    register: builder.mutation<User, any>({
      query(body) {
        return {
          url: "/register",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;

          if (data.id) {
            await dispatch(
              userApi.endpoints.getHost.initiate(data.id.toString())
            );
          }

          // dispatch(setUser(data));
          // dispatch(setIsAuthenticated(true));
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    login: builder.mutation<User, { email: string; password: string }>({
      query(body) {
        return {
          url: "/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;

          if (data.id) {
            await dispatch(
              userApi.endpoints.getHost.initiate(data.id.toString())
            );
          }

          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    logout: builder.query<void, void>({
      query: () => "/logout",
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } =
  authApi;
