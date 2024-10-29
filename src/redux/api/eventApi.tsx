import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface TicketCategory {
  id: string;
  currency: string;
  event_id: string;
  name: string;
  price: string;
  discount_price: string;
  wallet_discount: string;
  quantity: string;
  noofpeople: string;
}

interface Img {
  sn: string;
  eventId: string;
  img: string;
}

interface Event {
  sn: string;
  hostid: string;
  slug: string;
  title: string;
  currency: string;
  date: string;
  venue: string;
  paystack_bearer: string;
  event_cat: string;
  des: string;
  ticketCategories: TicketCategory[];
  // imgs: { img: string }[];
  start: { date: string; time: string }[];
  end: { date: string; time: string }[];
  from_date: string;
  from_time: string;
  to_date: string;
  to_time: string;
  images: string[];
  banner: File[];
  imgs: Img[];
}

interface EventResponse {
  data: Event[];
}

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASEURL}`,
    prepareHeaders: (headers) => {
      // Add any required headers here
      headers.set("Content-Type", "application/json");
      // Example for Authorization header
      // headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    updateHost: builder.mutation({
      query(body) {
        return {
          url: "eventhost/updateprofile",
          method: "POST",
          body,
        };
      },
    }),
    updateEvent: builder.mutation({
      query({ sn, eventData }) {
        const url = `/update/eventticket/${sn}`;
        console.log("API endpoint:", url);
        return {
          url,
          method: "POST",
          body: eventData,
        };
      },
    }),

    getAllHostEvents: builder.query({
      query: () => `host/allevents`,
    }),
    getHostEventById: builder.query<EventResponse, string>({
      query: (id) => `/eventbyHostId/${id}`,
    }),
    deleteEvent: builder.mutation({
      query(sn) {
        const url = `/delete/eventticket/${sn}`;
        console.log("Deleting event with endpoint:", url);
        return {
          url,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useUpdateHostMutation,
  useUpdateEventMutation,
  useGetAllHostEventsQuery,
  useGetHostEventByIdQuery,
  useDeleteEventMutation,
} = eventApi;
