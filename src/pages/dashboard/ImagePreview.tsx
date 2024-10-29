import React from "react";

interface ImagePreviewProps {
  newImages: File[];
  uploadedImages: string[];
  handleDeleteImage: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  newImages,
  uploadedImages,
  handleDeleteImage,
}) => {
  return (
    <div>
      <h4 className="text-white mb-2">Uploaded Images</h4>
      <div className="flex space-x-2">
        {uploadedImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Uploaded ${index}`}
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <h4 className="text-white mt-4 mb-2">New Images</h4>
      <div className="flex space-x-2">
        {newImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`New ${index}`}
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
