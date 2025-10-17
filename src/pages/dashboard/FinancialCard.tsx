import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useGetHostEventByIdQuery } from "../../redux/api/eventApi";
import f10 from "../../assets/images/f10.png";
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
interface FinancialCardProps {
  onViewReport: (eventId: string) => void;
}

interface EventResponse {
  data: Event[];
}

interface User {
  id: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ onViewReport }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  const updateStatus = useSelector(
    (state: RootState) => state.event.updateStatus
  );

  const { data: events, refetch } = useGetHostEventByIdQuery(user?.id!, {
    skip: !user?.id,
  });

  useEffect(() => {
    if (updateStatus) {
      refetch();
      dispatch(setUpdateStatus(false));
    }
  }, [updateStatus, refetch, dispatch]);

  const eventList: Event[] = events?.data || [];

  // Handle viewing financial report for specific event
  const handleViewReport = (eventId: string) => {
    onViewReport(eventId); // This will update the state in Dashboard
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap -mx-2">
        {eventList.map((event: Event) => (
          <div key={event.sn} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <div className="bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 flex flex-col h-full">
              <img
                className="w-full h-64 object-cover rounded-t-xl"
                src={
                  event.imgs[0]?.img
                    ? `${process.env.REACT_APP_IMAGEURL}/${event.imgs[0]?.img}`
                    : f10
                }
                alt="Event"
                onError={(e) => {
                  e.currentTarget.src = f10;
                }}
              />
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {event.title}
                </h3>
                <div className="mt-auto flex justify-center space-x-2">
                  <button
                    className="bg-[#25aae1] text-white py-2 px-6 rounded hover:bg-[#1a8abf]"
                    onClick={() => handleViewReport(event.sn)} // use event.sn as ID
                  >
                    View Financial Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialCard;
