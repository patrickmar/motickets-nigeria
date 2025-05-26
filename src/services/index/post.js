import axios from "axios";

export const getAllPosts = async () => {
  try {
    const { data } = await axios.get(
      "https://moticket-ng-blog.onrender.com/api/v1/posts"
    );
    console.log(data);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Updated to use slug instead of id
export const getSinglePost = async (slug) => {
  console.log(slug);
  try {
    const { data } = await axios.get(
      `https://moticket-ng-blog.onrender.com/api/v1/post/${slug}`
    );
    console.log(data);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
