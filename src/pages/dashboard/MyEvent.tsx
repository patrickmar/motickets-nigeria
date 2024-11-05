import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useGetHostEventByIdQuery } from "../../redux/api/eventApi";
import f10 from "../../assets/images/f10.png";
import toast from "react-hot-toast";
import { setUpdateStatus } from "../../features/eventSlice";

interface Event {
  sn: string;
  slug: string;
  hostid: string;
  title: string;
  currency: string;
  date: string;
  imgs: { img: string }[];
  ticketCategories: { price: string }[];
}

// interface EventResponse {
//   data: Event[];
// }

interface User {
  id: string;
}

const MyEvent: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  console.log(user);

  const updateStatus = useSelector(
    (state: RootState) => state.event.updateStatus
  );

  const { data: events } = useGetHostEventByIdQuery(user?.id!, {
    skip: !user?.id, // Skip the query if user ID is not available
  });

  useEffect(() => {
    if (updateStatus || user) {
      dispatch(setUpdateStatus(false)); // reset update status to false
    }
  }, [updateStatus, user, dispatch]);

  const navigate = useNavigate();

  const deleteEventHandler = async (eventid: string) => {
    console.log("Delete button clicked for event id:", eventid); // Confirm button click
    const url = `${process.env.REACT_APP_BASEURL}/delete/eventticket/${eventid}`;
    console.log("Delete endpoint URL:", url); // Log the endpoint URL

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const responseBody = await response.text();
      console.log("Response Body:", responseBody);

      if (!response.ok) {
        throw new Error(
          `Failed to delete event: ${response.status} ${response.statusText} - ${responseBody}`
        );
      }

      toast.success("Event Deleted");
      dispatch(setUpdateStatus((prev: boolean) => !prev)); // Use dispatch to update status
    } catch (error) {
      console.error("Delete event error:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const getPriceRange = (ticketCategories: { price: string }[]) => {
    const prices = ticketCategories.map((tc) => parseFloat(tc.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice };
  };

  const eventList: Event[] = events?.data || [];

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap -mx-2">
        {eventList.map((event: Event) => {
          const { minPrice, maxPrice } = getPriceRange(event.ticketCategories);
          return (
            <div key={event.sn} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <div className="bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 flex flex-col h-full">
                <img
                  className="w-full h-64 object-cover rounded-t-xl"
                  src={
                    event.imgs[0]?.img
                      ? `${process.env.REACT_APP_IMAGEURL}/${event.imgs[0]?.img}`
                      : f10
                  }
                  alt="eventing"
                  onError={(e) => {
                    e.currentTarget.src = f10; // fallback if image fails to load
                  }}
                />
                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-neutral-400">
                    {event.currency}{" "}
                    {minPrice === maxPrice
                      ? minPrice
                      : `${minPrice} - ${maxPrice}`}
                  </p>
                  <p className="mt-5 text-xs text-gray-500 dark:text-neutral-500">
                    {event.date}
                  </p>
                  <div className="mt-auto flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/details/${event.slug}`)}
                      className="bg-[#25aae1] text-white px-3 py-1 rounded hover:bg-[#1a8abf]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/update-event/${event.sn}`)}
                      className="text-white bg-[#0A0D36] py-1.5 px-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEventHandler(event.sn)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyEvent;
