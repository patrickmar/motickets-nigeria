import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setIsAuthenticated,
  setUser,
  setLoading,
} from "../../features/userSlice";
import { RootState } from "../store";

// Define the response type
interface User {
  id: string;
  email: string;
  image: string | null;
  submerchantId: string | null;
  fullname: string;
  hostname: string;
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
  bankCode: string;
  bvn: string;
  message: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  date: string;
  dateCreated: string;
  phone: string | null;
  country: string;
  about: string;
}

interface UpdateAvatarResponse {
  error: boolean;
  message: string;
  user: User | null;
}

type UsersResponse = User[];

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASEURL}/eventhost`,
  }),
  tagTypes: ["User"], // Add this line to declare tag types
  endpoints: (builder) => ({
    getHost: builder.query<UsersResponse, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: UsersResponse) => response,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          console.log("API response:", data); // Log the full API response
          if (data.length > 0) {
            dispatch(setUser(data[0]));
            dispatch(setIsAuthenticated(true));
          }
        } catch (error) {
          console.error(error);
        } finally {
          dispatch(setLoading(false));
        }
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateHost: builder.mutation({
      query(body) {
        return {
          url: "/updateprofile",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          console.log("UpdateHost response data:", data); // Log response data

          const state = getState() as RootState;
          const userId = state.auth?.user?.id; // Access user ID from state

          if (userId) {
            dispatch(
              userApi.util.invalidateTags([{ type: "User", id: userId }])
            );
          }
        } catch (error) {
          console.error("Error updating host profile:", error);
        }
      },
    }),
    updateProfile: builder.mutation({
      query(body) {
        return {
          url: "/changepass",
          method: "POST",
          body,
        };
      },
    }),

    usersFile: builder.query({
      query: (id) => `/${id}`,
    }),

    uploadAvatar: builder.mutation<UpdateAvatarResponse, FormData>({
      query(formData) {
        return {
          url: "/updatepics",
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("UpdateAvatar response data:", data);

          if (data && !data.error && data.user) {
            dispatch(setUser(data.user)); // Assuming `data.user` is of type `User`
          } else {
            console.error("Error in response data or empty user object");
          }
        } catch (error) {
          console.error("Error updating avatar:", error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/forgotpassemail",
          method: "POST",
          body,
        };
      },
    }),

    resetPassword: builder.mutation({
      query: ({ email, newpassword }) => ({
        url: "/resetpass",
        method: "POST",
        body: { email, newpassword },
      }),
    }),
  }),
});

export const {
  useUpdateHostMutation,
  useGetHostQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useForgotPasswordMutation,
  useUsersFileQuery,
  useResetPasswordMutation,
} = userApi;
