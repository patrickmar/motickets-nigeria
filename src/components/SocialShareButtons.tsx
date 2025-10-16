import toast from "react-hot-toast";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaCopy,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialShareButtons = ({ eventData }: { eventData: any }) => {
  const eventTitle = eventData?.title || "";

  // Extract text content from HTML description
  const getPlainTextDescription = () => {
    if (!eventData?.des) return "";

    // Create a temporary div to parse HTML and extract text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = eventData.des;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const eventDescription = getPlainTextDescription().substring(0, 100) + "...";
  const eventUrl = window.location.href;
  const imageUrl = eventData?.imgs?.[0]?.img
    ? `${process.env.REACT_APP_IMAGEURL || ""}${eventData.imgs[0].img}`
    : "";

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      eventUrl
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const shareText = `${eventTitle} - ${eventDescription}`;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(eventUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      eventUrl
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  //   const shareOnWhatsApp = () => {
  //     const shareText = `${eventTitle} - ${eventUrl}`;
  //     const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  //     window.open(shareUrl, "_blank", "width=600,height=400");
  //   };

  const shareOnInstagram = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `instagram://story-camera?url=${encodeURIComponent(
        eventUrl
      )}`;
    } else {
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "width=600,height=600"
      );
    }
  };

  const shareOnTikTok = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Open TikTok app for sharing if installed
      window.location.href = `snssdk1128://share?url=${encodeURIComponent(
        eventUrl
      )}`;
    } else {
      // Fallback: open TikTok on desktop
      window.open("https://www.tiktok.com/", "_blank", "width=600,height=600");
    }
  };

  const copyToClipboard = () => {
    const shareText = `${eventUrl}`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast.success("Event link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Event link copied to clipboard!");
      });
  };

  // Return JSX for the component
  return (
    <div className="social-share-buttons mt-4">
      <h3 className="text-white text-lg font-medium mb-2">Share this event:</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareOnFacebook}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          title="Share on Facebook"
        >
          <FaFacebook size={20} />
        </button>
        <button
          onClick={shareOnTwitter}
          className="bg-black hover:bg-gray-900 text-white p-2 rounded"
          title="Share on Twitter"
        >
          <FaXTwitter size={20} />
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded"
          title="Share on LinkedIn"
        >
          <FaLinkedin size={20} />
        </button>
        {/* <button
          onClick={shareOnWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          title="Share on WhatsApp"
        >
          <FaWhatsapp size={20} />
        </button> */}
        <button
          onClick={shareOnInstagram}
          className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded"
          title="Share on Instagram"
        >
          <FaInstagram size={20} />
        </button>
        <button
          onClick={shareOnTikTok}
          className="bg-black hover:bg-gray-800 text-white p-2 rounded"
          title="Share on TikTok"
        >
          <FaTiktok size={20} />
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
          title="Copy link"
        >
          <FaCopy size={20} />
        </button>
      </div>
    </div>
  );
};

export default SocialShareButtons;
