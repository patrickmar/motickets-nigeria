import React, { useState, useRef, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "../../assets/css/quill.css";
import { QuillFormats } from "../../constant";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { customAlphabet } from "nanoid";
import { useGetHostEventByIdQuery } from "../../redux/api/eventApi";
import { setUpdateStatus } from "../../features/eventSlice";
import { Link } from "react-router-dom";
import Editor from "react-simple-wysiwyg";

interface User {
  id: string;
}

interface TicketCategory {
  name: string;
  price: string;
  discountPrice: string;
  walletDiscount: string;
  qty: string;
  numOfPeople: string;
}

interface Category {
  name: string;
  price: string;
  discountPrice: string;
  walletDiscount: string;
  qty: string;
  numOfPeople: string;
}

type CurrencySymbolMap = {
  [key: string]: string;
  GBP: "£";
  USD: "$";
  NGN: "₦";
  EUR: "€";
};

const currencySymbolMap: CurrencySymbolMap = {
  GBP: "£",
  USD: "$",
  NGN: "₦",
  EUR: "€",
};

interface StartInfo {
  date: string;
  time: string;
}

interface EventData {
  eventTitle: string;
  venue: string;
  selectedImages?: File[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  description: string;
  ticketCategories: Category[];
  chargesBearer: string;
  currency: string;
  eventType: string;
  banner: File[];
  start: StartInfo[];
  end: StartInfo[];
}

// Image validation constants with ACTUAL acceptable sizes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];
// ACTUAL recommended dimensions for event images
const RECOMMENDED_IMAGE_DIMENSIONS = {
  primary: { width: 500, height: 550 }, // Main event banner
  secondary: { width: 220, height: 330 }, // Thumbnail/listing image
  max: { width: 5000, height: 5000 }, // Maximum allowed dimensions
};

const EditEventForm: React.FC = () => {
  const { sn } = useParams<{ sn: string }>();
  const formats = QuillFormats;
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showInformation, setShowInformation] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const dispatch = useDispatch();

  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  const hostid = user?.id || "";

  const { data: events } = useGetHostEventByIdQuery(user?.id!, {
    skip: !user?.id,
  });

  const [eventData, setEventData] = useState<EventData>({
    eventTitle: "",
    venue: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    description: "",
    ticketCategories: [
      {
        name: "Regular",
        price: "200",
        discountPrice: "0",
        walletDiscount: "0",
        qty: "10",
        numOfPeople: "10",
      },
    ],
    chargesBearer: "client",
    currency: "",
    eventType: "",
    banner: [],
    start: [
      {
        date: "",
        time: "",
      },
    ],
    end: [
      {
        date: "",
        time: "",
      },
    ],
  });

  // Function to validate image file
  const validateImageFile = (
    file: File
  ): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Image "${
          file.name
        }" is too large. Maximum size is 5MB. Your file is ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB.`,
      };
    }

    // Check file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type for "${file.name}". Only JPEG, PNG, and GIF images are allowed.`,
      };
    }

    return { isValid: true };
  };

  // Function to check image dimensions and provide specific recommendations
  const checkImageDimensions = (
    file: File
  ): Promise<{
    isValid: boolean;
    error?: string;
    dimensions?: { width: number; height: number };
  }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const dimensions = { width: img.width, height: img.height };

        if (
          img.width > RECOMMENDED_IMAGE_DIMENSIONS.max.width ||
          img.height > RECOMMENDED_IMAGE_DIMENSIONS.max.height
        ) {
          resolve({
            isValid: false,
            error: `Image "${file.name}" dimensions (${img.width}x${img.height}) are too large. Maximum allowed dimensions are ${RECOMMENDED_IMAGE_DIMENSIONS.max.width}x${RECOMMENDED_IMAGE_DIMENSIONS.max.height} pixels.`,
            dimensions,
          });
        } else {
          resolve({
            isValid: true,
            dimensions,
            error:
              img.width < RECOMMENDED_IMAGE_DIMENSIONS.primary.width ||
              img.height < RECOMMENDED_IMAGE_DIMENSIONS.primary.height
                ? `Note: For best quality, use images at least ${RECOMMENDED_IMAGE_DIMENSIONS.primary.width}x${RECOMMENDED_IMAGE_DIMENSIONS.primary.height} pixels.`
                : undefined,
          });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          isValid: false,
          error: `Failed to load image "${file.name}" for dimension validation.`,
        });
      };

      img.src = url;
    });
  };

  useEffect(() => {
    if (events && events.data) {
      const event = events.data.find((e) => e.sn === sn);
      if (event) {
        setEventData({
          eventTitle: event.title,
          venue: event.venue,
          startTime: `${event.from_time}`,
          endTime: `${event.to_time}`,
          startDate: event.from_date,
          endDate: event.to_date,
          description: event.des,
          ticketCategories: event.ticketCategories.map((category) => ({
            name: category.name,
            price: category.price,
            discountPrice: "0",
            walletDiscount: "0",
            qty: category.quantity,
            numOfPeople: category.noofpeople,
          })),
          chargesBearer: event.paystack_bearer,
          currency: event.currency,
          eventType: event.event_cat,
          banner: [],
          start: [{ date: event.from_date, time: event.from_time }],
          end: [{ date: event.to_date, time: event.to_time }],
        });

        const fetchedImages = event.imgs
          ? event.imgs.map(
              (img) => `${process.env.REACT_APP_IMAGEURL}/${img.img}`
            )
          : [];
        setExistingImages(fetchedImages);
      }
    }
  }, [events, sn]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleDescriptionChange = (e: { target: { value: string } }) => {
    setEventData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      name: "",
      price: "",
      discountPrice: "0",
      walletDiscount: "0",
      qty: "",
      numOfPeople: "",
    };

    setEventData((prevData) => ({
      ...prevData,
      ticketCategories: [...prevData.ticketCategories, newCategory],
    }));
  };

  const handleCategoryChange = (
    index: number,
    key: keyof TicketCategory,
    value: string | number
  ) => {
    const newCategories = [...eventData.ticketCategories];
    newCategories[index] = { ...newCategories[index], [key]: value };
    setEventData({ ...eventData, ticketCategories: newCategories });
  };

  const handleCurrencyChange = (currency: string) => {
    setEventData({ ...eventData, currency });
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCategories = [...eventData.ticketCategories];
    updatedCategories.splice(index, 1);
    setEventData({ ...eventData, ticketCategories: updatedCategories });
  };

  const ampmOptions = ["AM", "PM"];

  const [startAmPm, setStartAmPm] = useState<string>("AM");
  const [endAmPm, setEndAmPm] = useState<string>("AM");

  const handleStartAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartAmPm(e.target.value);
  };

  const handleEndAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndAmPm(e.target.value);
  };

  const handleStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newStart = [...eventData.start];
    newStart[index].date = e.target.value;
    setEventData({ ...eventData, start: newStart });
  };

  const handleEndDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newEnd = [...eventData.end];
    newEnd[index].date = e.target.value;
    setEventData({ ...eventData, end: newEnd });
  };

  const handleStartTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newStart = [...eventData.start];
    newStart[index].time = e.target.value;
    setEventData({ ...eventData, start: newStart });
  };

  const handleEndTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newEnd = [...eventData.end];
    newEnd[index].time = e.target.value;
    setEventData({ ...eventData, end: newEnd });
  };

  const handleImageDelete = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const updatedImages = [...existingImages];
      updatedImages.splice(index, 1);
      setExistingImages(updatedImages);
    } else {
      const updatedImages = [...selectedImages];
      updatedImages.splice(index, 1);
      setSelectedImages(updatedImages);
    }
  };

  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setEventData({ ...eventData, eventType: value });
  };

  // Function to convert base64 string to Blob
  const base64ToBlob = (base64String: string): Blob => {
    const byteString = atob(base64String.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: "image/png" });
  };

  const handleNewImageChange = async (files: FileList | null) => {
    if (!files) return;

    const selectedImagesArray = Array.from(files);

    // Check total number of images
    if (selectedImagesArray.length > 5) {
      toast.error(`Can't select more than five images`);
      return;
    }

    // Validate each image
    for (const file of selectedImagesArray) {
      // Basic file validation
      const fileValidation = validateImageFile(file);
      if (!fileValidation.isValid) {
        toast.error(fileValidation.error);
        return;
      }

      // Dimension validation
      try {
        const dimensionValidation = await checkImageDimensions(file);
        if (!dimensionValidation.isValid) {
          toast.error(dimensionValidation.error);
          return;
        }
      } catch (error) {
        toast.error(`Error validating image "${file.name}"`);
        console.error("Image validation error:", error);
        return;
      }
    }

    // If all validations pass, add images to state
    setSelectedImages(selectedImagesArray);
    setExistingImages([]);

    toast.success(`${selectedImagesArray.length} image(s) added successfully`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      // Final image validation before submission
      if (selectedImages.length === 0 && existingImages.length === 0) {
        throw new Error("At least one event image is required");
      }

      const formData = new FormData();
      formData.append("hostid", hostid);

      const sanitizedEventData = {
        ...eventData,
        description: eventData.description
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"'),
      };

      Object.entries(sanitizedEventData).forEach(([key, value]) => {
        if (key === "ticketCategories" && Array.isArray(value)) {
          value.forEach((category: any, index: number) => {
            Object.entries(category).forEach(([subKey, subValue]) => {
              formData.append(
                `ticketCategories[${index}][${subKey}]`,
                String(subValue)
              );
            });
          });
        } else if (Array.isArray(value)) {
          value.forEach((item: any, index: number) => {
            Object.entries(item).forEach(([subKey, subValue]) => {
              formData.append(`${key}[${index}][${subKey}]`, String(subValue));
            });
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const nanoid = customAlphabet("123456789", 11);

      for (let i = 0; i < selectedImages.length; i++) {
        const base64 = await getBase64(selectedImages[i]);
        const blob = base64ToBlob(base64);
        const elevenDigitName = nanoid();
        const fileExtension = selectedImages[i].name.split(".").pop();
        const banner = new File([blob], `${elevenDigitName}.${fileExtension}`, {
          type: selectedImages[i].type,
          lastModified: selectedImages[i].lastModified,
        });
        formData.append("banner[]", banner);
        console.log(`Renamed Image: ${banner.name}`);
      }

      const logObject: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        if (key === "banner[]") {
          if (!logObject[key]) {
            logObject[key] = [];
          }
          logObject[key].push(value);
        } else {
          logObject[key] = value;
        }
      });
      console.log(logObject);

      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/update/eventticket/${sn}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Fail to update event");
      }
      console.log(response);
      const data = await response.json();
      console.log(data);

      if (data.error === false) {
        toast.success(data.message);
        dispatch(setUpdateStatus(true));
        setIsSubmitting(true);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error: any) {
      setSubmissionError(error.message || "Error creating event");
      toast.error(error.message || "Error updating event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as data URL."));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInformationClick = () => {
    setShowInformation((prevShowInformation) => !prevShowInformation);
  };

  return (
    <div className="flex items-center justify-center bg-[#04152d]">
      <div className="bg-gray-300/10 p-8 rounded shadow-lg w-4/5 lg:w-3/5 mt-24">
        <h2 className="text-2xl font-semibold mb-4 text-white">Update Event</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-600 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  name="eventTitle"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={eventData.eventTitle}
                  onChange={handleChange}
                  required
                  placeholder="Da Ministry reunion"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="venue" className="block text-gray-600 mb-2">
                  Event Venue
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={eventData.venue}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="banner" className="block text-gray-600">
                  Event Images (Up to 5)
                </label>
                <div className="border border-dashed p-12 rounded-md">
                  <div className="flex items-center">
                    <label
                      htmlFor="banner"
                      className="cursor-pointer bg-[#25aae1] text-white px-4 py-2 rounded-md mr-2 focus:outline-none"
                    >
                      Replace Image
                    </label>
                    <input
                      type="file"
                      id="banner"
                      name="banner"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      className="hidden"
                      onChange={(e) => handleNewImageChange(e.target.files)}
                      ref={fileInputRef}
                      multiple
                    />
                    <div
                      className="cursor-pointer bg-gray-300 text-gray-600 rounded-full flex items-center justify-center w-6 h-6 text-sm lg:w-8 lg:h-8 lg:text-base"
                      onClick={handleInformationClick}
                      style={{ fontSize: "0.75rem" }}
                    >
                      i
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 5MB | Supported formats: JPEG, PNG, GIF
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap">
                  {existingImages.map((image, index) => (
                    <div key={index} className="mr-2 mb-2 relative">
                      <img
                        src={image}
                        alt={`Event Image ${index + 1}`}
                        className="h-24 w-24 object-cover border rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => handleImageDelete(index, true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4"
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
                  ))}
                  {selectedImages.map((image, index) => (
                    <div key={index} className="mr-2 mb-2 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Event Image ${index + 1}`}
                        className="h-24 w-24 object-cover border rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => handleImageDelete(index, false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div className="text-xs mt-1 text-center">
                        {(image.size / 1024 / 1024).toFixed(2)}MB
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showInformation && (
                <div className="bg-white p-4 border rounded-md">
                  <p className="italic text-blue-400">
                    Event graphics preferably include dimensions (220 by 330 px)
                    and (500 by 550 px) but any size provided may be resized to
                    fit. Supported formats are jpg, jpeg, png, gif.
                    <br />
                    <strong>Maximum file size: 5MB per image</strong>
                    <br />
                    <strong>Recommended dimensions:</strong>
                    <br />• Primary:{" "}
                    {RECOMMENDED_IMAGE_DIMENSIONS.primary.width} ×{" "}
                    {RECOMMENDED_IMAGE_DIMENSIONS.primary.height}px
                    <br />• Secondary:{" "}
                    {RECOMMENDED_IMAGE_DIMENSIONS.secondary.width} ×{" "}
                    {RECOMMENDED_IMAGE_DIMENSIONS.secondary.height}px
                  </p>
                </div>
              )}
            </>
          )}

          {/* Rest of the component remains the same */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-600 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={eventData.start[0].date}
                  onChange={(e) => handleStartDateChange(e, 0)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-gray-600 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={eventData.end[0].date}
                  onChange={(e) => handleEndDateChange(e, 0)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-600 mb-2">
                  Start Time
                </label>
                <div className="flex items-center">
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={eventData.start[0].time}
                    onChange={(e) => handleStartTimeChange(e, 0)}
                    required
                  />
                  <select
                    value={startAmPm}
                    onChange={handleStartAmPmChange}
                    className="ml-2 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                  >
                    {ampmOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="endTime" className="block text-gray-600 mb-2">
                  End Time
                </label>
                <div className="flex items-center">
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={eventData.end[0].time}
                    onChange={(e) => handleEndTimeChange(e, 0)}
                    required
                  />
                  <select
                    value={endAmPm}
                    onChange={handleEndAmPmChange}
                    className="ml-2 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                  >
                    {ampmOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="mb-4" data-name="description">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-white "
                >
                  Description
                </label>
                <Editor
                  value={eventData.description || ""}
                  onChange={handleDescriptionChange}
                  containerProps={{
                    className:
                      "add-new-post__editor mb-1 text-gray-900 bg-gray-50",
                    style: {
                      height: "400px",
                      width: "800px",
                    },
                  }}
                />
                <p className="text-xs text-gray-400">
                  Give a full description. Not more than 3000 characters
                </p>
              </div>
              <div className="mb-4">
                <select
                  id="eventType"
                  name="eventType"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={eventData.eventType}
                  onChange={handleEventTypeChange}
                >
                  <option value="">Select Event Type</option>
                  <option value="Festival">Festival</option>
                  <option value="Conference">Conference</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Executive Meeting">Executive Meeting</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Comedy and Standup">Comedy and Standup</option>
                  <option value="Musical Show">Musical Show</option>
                  <option value="Trade Fair">Trade Fair</option>
                  <option value="Charity Events/Fundraisers">
                    Charity Events/Fundraisers
                  </option>
                  <option value="Club Nights and Bars">
                    Club Nights and Bars
                  </option>
                  <option value="Concerts">Concerts</option>
                  <option value="Cultural Events">Cultural Events</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Film Screenings">Film Screenings</option>
                  <option value="Galas/Dinners">Galas/Dinners</option>
                  <option value="Gigs">Gigs</option>
                  <option value="Sports Events">Sports Events</option>
                  <option value="Theatre/Performing Arts">
                    Theatre/Performing Arts
                  </option>
                  <option value="Workshops">Workshops</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1" style={{ display: "none" }}>
                  <label
                    htmlFor="bearer"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Charge Bearer
                  </label>
                  <select
                    id="bearer"
                    name="bearer"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={eventData.chargesBearer}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        chargesBearer: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Bearer</option>
                    <option value="client">Client</option>
                    <option value="moloyal">MoTickets</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="currency"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={eventData.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                  >
                    <option value="">Select Currency</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white">
                Ticket Categories
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full mb-4">
                  <thead className="bg-[#25aae1]">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">
                        Price ({currencySymbolMap[eventData.currency]})
                      </th>
                      <th className="px-4 py-2" style={{ display: "none" }}>
                        Discount Price(
                        {currencySymbolMap[eventData.currency]})
                      </th>

                      <th className="px-4 py-2" style={{ display: "none" }}>
                        Wallet Discount
                      </th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Number Of People</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventData.ticketCategories.map((category, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={category.name}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={category.price}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td
                          className="border px-4 py-2"
                          style={{ display: "none" }}
                        >
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={category.discountPrice}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "discountPrice",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td
                          className="border px-4 py-2"
                          style={{ display: "none" }}
                        >
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={category.walletDiscount}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "walletDiscount",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={category.qty}
                            onChange={(e) =>
                              handleCategoryChange(index, "qty", e.target.value)
                            }
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={category.numOfPeople}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "numOfPeople",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleDeleteCategory(index)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                className="text-white bg-[#25aae1] px-4 py-2 rounded-md"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </>
          )}

          <div className="mt-6 flex justify-between">
            {step !== 1 && (
              <button
                type="button"
                className="text-white bg-[#c10006] px-6 py-2 rounded-md"
                onClick={handlePreviousStep}
              >
                Previous
              </button>
            )}
            {step !== 4 ? (
              <button
                type="button"
                className="text-white bg-[#25aae1] px-6 py-2 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleNextStep}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="text-white bg-[#25aae1] px-6 py-2 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
                    updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            )}
          </div>
        </form>
        {submissionError && (
          <div className="text-red-500 mt-4">{submissionError}</div>
        )}
        <div className="flex justify-center items-center">
          <Link
            to="/dashboard"
            className="text-white bg-red-500 px-6 py-2 rounded-md"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;
