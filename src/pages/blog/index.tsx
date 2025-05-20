import React from "react";
import SliderIndicatorsInside from "../../components/SliderIndicatorsInside";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/index/post";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const Blog = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
    onError: (error: any) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const sortedPosts = data
    ? [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const sliderPosts =
    sortedPosts.length > 5
      ? sortedPosts.slice(0, 5)
      : sortedPosts.length > 1
      ? sortedPosts
      : [];

  return (
    <>
      <Helmet>
        <title>MoTickets Blog – Event & Ticketing News</title>
        <meta
          name="description"
          content="Stay updated with the latest articles on events, entertainment, ticketing tips, and MoTickets updates."
        />
        <meta
          name="keywords"
          content="blog, events, tickets, concerts, motickets, news, entertainment"
        />
        <meta name="author" content="MoTickets" />

        <meta
          property="og:title"
          content="MoTickets Blog – Event & Ticketing News"
        />
        <meta
          property="og:description"
          content="Read the latest insights and updates on events, concerts, and ticketing trends with MoTickets blog."
        />
        <meta
          property="og:image"
          content="https://www.motickets.com/blog-og-image.jpg"
        />
        <meta property="og:url" content="https://www.motickets.ng/blog" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="MoTickets Blog – Event & Ticketing News"
        />
        <meta
          name="twitter:description"
          content="Insights, guides, and updates about tickets, events, and more from MoTickets."
        />
        <meta
          name="twitter:image"
          content="https://www.motickets.ng/blog-og-image.jpg"
        />

        <link rel="canonical" href="https://www.motickets.ng/blog" />
      </Helmet>

      <div>
        {sliderPosts.length > 1 && (
          <SliderIndicatorsInside posts={sliderPosts} />
        )}
        <div>
          <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
            <div className="border-b mb-5 flex justify-between text-sm">
              <div className="text-indigo-600 flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase">
                <svg
                  className="h-6 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 455.005 455.005"
                  fill="currentColor"
                >
                  {/* SVG content omitted for brevity */}
                </svg>
                <a href="#" className="font-semibold inline-block">
                  Motickets Blog
                </a>
              </div>
              <a href="#">See All</a>
            </div>

            {isLoading && <p>Loading posts...</p>}
            {isError && <p>Failed to load posts.</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {data?.map((post: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded overflow-hidden shadow-lg flex flex-col"
                >
                  <div className="relative">
                    <a href={`/blog-details/${post.id}`}>
                      <img
                        className="w-full h-56 object-cover"
                        src={post.image}
                        alt={post.title}
                      />
                      <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25" />
                    </a>
                    <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3">
                      {post.category || "Blog"}
                    </div>
                  </div>
                  <div className="px-6 py-4 mb-auto">
                    <a
                      href={`/blog-details/${post.id}`}
                      className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
                    >
                      {post.title}
                    </a>
                    <p className="text-gray-500 text-sm">
                      {post.description
                        ? post.description
                            .replace(/<[^>]*>?/gm, "")
                            .substring(0, 100) + "..."
                        : "No description available."}
                    </p>
                  </div>
                  <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                    <span className="py-1 text-xs text-gray-900 mr-1 flex items-center">
                      <span className="ml-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                    <span className="py-1 text-xs text-gray-900 mr-1 flex items-center">
                      <span className="ml-1">
                        {post.commentsCount || 0} Comments
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
