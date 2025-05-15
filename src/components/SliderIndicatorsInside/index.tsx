import { useEffect } from "react";
import Glide from "@glidejs/glide";
import { FaCalendarAlt, FaRegClock } from "react-icons/fa";

export default function SliderIndicatorsInside({
  posts = [],
}: {
  posts: any[];
}) {
  useEffect(() => {
    const slider = new Glide(".glide-02", {
      type: "slider",
      focusAt: "center",
      perView: 1,
      autoplay: 3500,
      animationDuration: 700,
      gap: 0,
      classes: {
        direction: {
          ltr: "glide--ltr",
          rtl: "glide--rtl",
        },
        type: {
          carousel: "glide--carousel",
          slider: "glide--slider",
        },
        slide: {
          clone: "glide__slide--clone",
          active: "glide__slide--active",
        },
        arrow: {
          disabled: "glide__arrow--disabled",
        },
        nav: {
          active: "[&>*]:bg-wuiSlate-700",
        },
        swipeable: "glide--swipeable",
        dragging: "glide--dragging",
      },
    }).mount();

    return () => {
      slider.destroy();
    };
  }, []);

  return (
    <div className="relative w-full glide-02">
      <div className="overflow-hidden" data-glide-el="track">
        <ul className="relative flex w-full overflow-hidden p-24">
          {posts.map((post, index) => (
            <li key={index}>
              <div className="flex w-full h-[500px] px-10 py-8 gap-10 items-center">
                {/* Left Side – Image */}
                <div className="w-1/2 h-full rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Right Side – Text */}
                <div className="w-1/2 h-full flex items-center justify-center bg-white">
                  <div className="w-full max-w-md">
                    <h1 className="text-black font-semibold text-3xl mb-4">
                      {post.title}
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {post.description
                        ? post.description
                            .replace(/<[^>]*>?/gm, "")
                            .substring(0, 100) + "..."
                        : "No description available."}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center s pace-x-1">
                        <FaCalendarAlt className="text-[#25aae1]" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaRegClock className="text-[#25aae1]" />
                        <span>2 mins read</span>
                      </div>
                    </div>
                    <a
                      href={`/blog-details/${post.id}`}
                      className="bg-[#c10006] text-white py-3 px-6 rounded-lg inline-block"
                    >
                      View Post
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="absolute bottom-0 flex items-center justify-center w-full gap-2"
        data-glide-el="controls[nav]"
      >
        {posts.map((_, index) => (
          <button
            key={index}
            className="p-4 group"
            data-glide-dir={`=${index}`}
            aria-label={`goto slide ${index + 1}`}
          >
            <span className="block w-2 h-2 transition-colors duration-300 rounded-full bg-white/20 ring-1 ring-slate-700 focus:outline-none"></span>
          </button>
        ))}
      </div>
    </div>
  );
}
