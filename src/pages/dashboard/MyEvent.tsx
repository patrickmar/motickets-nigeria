import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  useDeleteEventMutation,
  useGetHostEventByIdQuery,
} from "../../redux/api/eventApi";
import f10 from "../../assets/images/f10.png";
import toast from "react-hot-toast";
import { setUpdateStatus } from "../../features/eventSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";

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

interface EventResponse {
  data: Event[];
}

interface User {
  id: string;
}

// First, add this interface at the top of your file
interface EmailApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

const MyEvent: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;

  const updateStatus = useSelector(
    (state: RootState) => state.event.updateStatus
  );

  const { data: events } = useGetHostEventByIdQuery(user?.id!, {
    skip: !user?.id,
  });

  // State for email modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });
  const [includeEventDetails, setIncludeEventDetails] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 10,
  });

  useEffect(() => {
    if (updateStatus || user) {
      dispatch(setUpdateStatus(false));
    }
  }, [updateStatus, user, dispatch]);

  const navigate = useNavigate();

  const deleteEventHandler = async (eventid: string) => {
    const url = `${process.env.REACT_APP_BASEURL}/delete/eventticket/${eventid}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const responseBody = await response.text();

      if (!response.ok) {
        throw new Error(
          `Failed to delete event: ${response.status} ${response.statusText} - ${responseBody}`
        );
      }

      toast.success("Event Deleted");
      dispatch(setUpdateStatus((prev: boolean) => !prev));
    } catch (error) {
      console.error("Delete event error:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const handleEmailButtonClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEmailModalOpen(true);
    setEmailData({
      subject: `Regarding your event: ${event.title}`,
      message: `<p>Hello,</p><p><br></p><p>This is regarding your event <strong>"${event.title}"</strong> scheduled for ${event.date}.</p>`,
    });
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAddImages = async (eventid: string) => {
    if (files.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }

    setUploadingImages(true);

    try {
      const formData = new FormData();
      formData.append("eventid", eventid);
      formData.append("hostid", user?.id || "");

      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await fetch(
        // "https://moloyal.com/mosave_ukdemo/script/api/eventhost/addpics",
        `${process.env.REACT_APP_BASEURL}/eventhost/addpics`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const result = await response.json();

      if (result.status) {
        toast.success("Images uploaded successfully!");
        setIsImageModalOpen(false);
        setFiles([]);
        dispatch(setUpdateStatus((prev: boolean) => !prev));
      } else {
        throw new Error(result.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images"
      );
    } finally {
      setUploadingImages(false);
    }
  };

  // Then update the handleSendEmail function in your component
  const handleSendEmail = async () => {
    if (!selectedEvent) return;

    if (!emailData.subject.trim()) {
      toast.error("Please enter a subject for the email");
      return;
    }

    if (!emailData.message.trim() || emailData.message === "<p><br></p>") {
      toast.error("Please enter a message for the email");
      return;
    }

    setIsSending(true);

    try {
      // Prepare the request body
      const requestBody = {
        eventid: selectedEvent.sn,
        subject: emailData.subject,
        content: emailData.message, // Using just the message without event details
      };

      // Make the API call
      const response = await fetch(
        // "https://moloyal.com/mosave_ukdemo/script/api/host/email_customer",
        `${process.env.REACT_APP_BASEURL}/host/email_customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // First check if response is OK (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse JSON, but handle cases where response might be empty
      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Response wasn't valid JSON, treating as empty");
        data = {};
      }

      // If we got here, the request was successful
      toast.success("Email sent successfully!");
      setIsEmailModalOpen(false);
      setEmailData({
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send email. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };
  const getPriceRange = (ticketCategories: { price: string }[]) => {
    const prices = ticketCategories.map((tc) => parseFloat(tc.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice };
  };

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  const eventList: Event[] = events?.data || [];
  console.log(selectedEvent);

  return (
    <div className="container mx-auto">
      {/* Enhanced Email Modal */}
      {isEmailModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Send Email to Attendees
              </h2>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="overflow-y-auto scrollbar p-6 flex-1">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedEvent.title}</p>
                  <p className="text-sm text-gray-600">
                    • {selectedEvent.currency}{" "}
                    {getPriceRange(selectedEvent.ticketCategories).minPrice ===
                    getPriceRange(selectedEvent.ticketCategories).maxPrice
                      ? getPriceRange(selectedEvent.ticketCategories).minPrice
                      : `${
                          getPriceRange(selectedEvent.ticketCategories).minPrice
                        } - ${
                          getPriceRange(selectedEvent.ticketCategories).maxPrice
                        }`}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="rounded-md border border-gray-300">
                  <ReactQuill
                    theme="snow"
                    value={emailData.message}
                    onChange={(value) =>
                      setEmailData({ ...emailData, message: value })
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="[&>.ql-container]:border-none [&>.ql-toolbar]:border-none"
                    placeholder="Write your email content here..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Upload Event Images
              </h2>
              <button
                onClick={() => {
                  setIsImageModalOpen(false);
                  setFiles([]);
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto scrollbar p-6 flex-1">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive ? (
                    <span className="text-blue-500">Drop the files here</span>
                  ) : (
                    <>
                      Drag & drop images here, or click to select files
                      <br />
                      <span className="text-xs text-gray-500">
                        (Supports JPEG, PNG, GIF. Max 10 files)
                      </span>
                    </>
                  )}
                </p>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files ({files.length})
                  </h3>
                  <ul className="border rounded-md divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center p-3">
                        <div className="flex-shrink-0 h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={() => {
                  setIsImageModalOpen(false);
                  setFiles([]);
                }}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddImages(selectedEvent.sn)}
                disabled={uploadingImages || files.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {uploadingImages ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload Images"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Cards */}
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
                  alt="Event Image"
                  onError={(e) => {
                    e.currentTarget.src = f10;
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
                    {/* Add Images Button */}
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsImageModalOpen(true);
                      }}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                    >
                      Add Images
                    </button>
                    <button
                      onClick={() => handleEmailButtonClick(event)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Email
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
