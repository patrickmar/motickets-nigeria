import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import ContentWrapper from "../ContentWrapper";
import Img from "../LazyLoadImage";
import bg from "../../assets/images/moticket-bg2.png";
import BannerBill from "./banner";

type Props = {};

const HeroBanner = (props: Props) => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const currency = process.env.REACT_APP_CURRENCY;
  const { data, loading } = useFetch(`/eventspercurrency/${currency}`);

  useEffect(() => {
    setBackground(bg);
  }, [data]);

  const searchQueryHandler = (event: any) => {
    if ((event.key === "Enter" || event.type === "click") && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  return (
    <div className="heroBanner relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with artistic overlay */}
      {!loading ? (
        <div className="absolute inset-0 w-full h-full">
          <div className="backdrop-img absolute inset-0">
            <BannerBill />
          </div>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#25aae1]/20 to-[#c10006]/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>

          {/* Animated floating elements */}
          <div className="absolute top-20 left-10 w-6 h-6 bg-[#25aae1] rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-8 h-8 bg-[#c10006] rounded-full opacity-15 animate-float-delayed"></div>
          <div className="absolute bottom-40 left-20 w-4 h-4 bg-white rounded-full opacity-10 animate-float-slow"></div>
        </div>
      ) : (
        <SkeletonBanner />
      )}

      <ContentWrapper>
        <div className="heroBannerContent relative z-10 text-center w-full">
          {/* Main Title with Artistic Typography */}
          <div className="mb-8">
            <h1 className="title text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-white via-[#25aae1] to-[#c10006] bg-clip-text text-transparent leading-tight">
              Unlock the Fun
            </h1>
            <div className="subTitle text-xl md:text-2xl font-light text-white/90 mb-2">
              Your Ticket to Unforgettable Events
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-[#25aae1] to-[#c10006] mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Search Input - EXTRA LONG VERSION */}
          <div
            className={`searchInput relative w-full max-w-6xl mx-auto transition-all duration-500 ${
              isSearchFocused ? "scale-105" : "scale-100"
            }`}
          >
            <div className="relative group w-full">
              <input
                type="text"
                value={query}
                placeholder="Search for events, concerts, festivals, sports games, theater shows, conferences, workshops, parties, exhibitions, and much more..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="w-full h-16 md:h-20 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl pl-8 pr-40 text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#25aae1] focus:bg-white/100 transition-all duration-300 shadow-2xl group-hover:bg-white/100 group-hover:border-white/50"
              />

              {/* Search Icon - Larger and more prominent */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={searchQueryHandler}
                  disabled={!query.length}
                  className={`bg-gradient-to-r from-[#25aae1] to-[#1e8fc5] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg ${
                    query.length
                      ? "hover:from-[#1e8fc5] hover:to-[#25aae1] hover:scale-105 hover:shadow-xl"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-lg font-semibold">Search</span>
                </button>
              </div>
            </div>

            {/* Search Suggestions - Clean and simple */}
            {isSearchFocused && query.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden animate-fade-in">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-3 font-medium text-center">
                    Start typing to discover amazing events...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Event Stats */}
          {!loading && data?.data && (
            <div className="mt-16 flex justify-center items-center gap-12 text-white/80">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {data.data.length}+
                </div>
                <div className="text-base md:text-lg">Live Events</div>
              </div>
              <div className="w-1 h-12 bg-white/30 rounded-full"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  100%
                </div>
                <div className="text-base md:text-lg">Verified</div>
              </div>
              <div className="w-1 h-12 bg-white/30 rounded-full"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  24/7
                </div>
                <div className="text-base md:text-lg">Support</div>
              </div>
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-white/60">
              <span className="text-sm mb-2">Explore More</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

// Skeleton Loading Component - Updated for extra long search
const SkeletonBanner = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 animate-pulse">
      {/* Skeleton Background Elements */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-r from-gray-700 to-gray-800"></div>
      </div>

      {/* Skeleton Content */}
      <ContentWrapper>
        <div className="heroBannerContent relative z-10 text-center w-full">
          {/* Skeleton Title */}
          <div className="mb-8">
            <div className="h-16 md:h-24 bg-gray-600 rounded-2xl mx-auto max-w-6xl mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-600 rounded-lg mx-auto max-w-3xl mb-2 animate-pulse"></div>
            <div className="h-1 bg-gray-600 rounded-full mx-auto w-24 animate-pulse"></div>
          </div>

          {/* Skeleton Search Input - Extra Long */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="h-16 md:h-20 bg-gray-600/50 rounded-2xl animate-pulse"></div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-36 h-14 bg-gray-500 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Stats */}
          <div className="mt-16 flex justify-center items-center gap-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-12">
                <div className="text-center">
                  <div className="h-10 md:h-12 bg-gray-600 rounded-lg w-20 animate-pulse mb-2"></div>
                  <div className="h-5 bg-gray-600 rounded w-16 animate-pulse"></div>
                </div>
                {i < 2 && (
                  <div className="w-1 h-12 bg-gray-600 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Skeleton Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="h-4 bg-gray-600 rounded w-20 animate-pulse mb-2"></div>
              <div className="w-5 h-5 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
