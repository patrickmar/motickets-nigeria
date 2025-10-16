import { useState, useRef, useEffect } from "react";
import moroccobanner from "../../assets/images/moroccobanner.jpeg";

const BannerBill = () => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-[44rem] relative">
      {/* Beautiful Gradient Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-200 via-blue-100 to-amber-100">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[length:16px_16px]"></div>
        </div>
      )}

      {/* Hidden image loader */}
      <img
        ref={imgRef}
        src={moroccobanner}
        alt=""
        className="hidden"
        onLoad={handleImageLoad}
        onError={() => setIsLoading(false)}
      />

      {/* Background Image */}
      <div
        className={`w-full h-full bg-cover bg-center transition-all duration-1000 ${
          isLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
        }`}
        style={{
          backgroundImage: `url(${moroccobanner})`,
        }}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="text-center">{/* Your content */}</div>
      </div>
    </div>
  );
};

export default BannerBill;
