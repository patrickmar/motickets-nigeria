import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getSinglePost } from "../../services/index/post";

const BlogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost(id),
    queryKey: ["details", id],
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isLoading) {
    return <p className="pt-32 text-center">Loading...</p>;
  }

  if (isError || !data) {
    return (
      <p className="pt-32 text-center text-red-500">Failed to load post.</p>
    );
  }

  return (
    <main className="container mx-auto mt-8 pt-32">
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-8/12 px-4 mb-8">
          <img
            src={data.image}
            alt="Featured Image"
            className="w-full h-64 object-cover rounded"
          />
          <h2 className="text-4xl font-bold mt-4 mb-2">{data.title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: data.description }}
            className="text-gray-700 mb-4"
          />
        </div>
        <div className="w-full md:w-4/12 px-4 mb-8">
          <div className="bg-gray-100 px-4 py-6 rounded">
            <h3 className="text-lg font-bold mb-2">Categories</h3>
            <ul className="list-disc list-inside">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Travel
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Food
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogDetailsPage;
