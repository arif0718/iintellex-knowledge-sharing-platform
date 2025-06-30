import React from "react";
import useGetAllPost from "@/hooks/useGetAllPost";
import { useSelector } from "react-redux";
import LeftSidebar from "./LeftSidebar";

const InsightsFeed = () => {
  useGetAllPost(); // Fetches all posts using Redux
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="pl-[2%] pr-[2%] md:pl-[19%] md:pr-2 pt-8 min-h-screen bg-gray-50 ">

      <div className="md:hidden flex">
        <div className="md:hidden flex items-center justify-between w-full px-4 ">
          <div className="z-40">
            <img src="/iintellex-logo.png" alt="logo" className="w-20 mb-4" />
          </div>
        </div>
        <LeftSidebar />
      </div>
      
      <div className="columns-2 xs:columns-2 md:columns-3 lg:columns-4 gap-1 md:gap-4 space-y-4 ">
        {posts.map((post) => (
          <div
            key={post._id}
            className="break-inside-avoid mb-2 md:mb-4 bg-white shadow-md rounded-lg "
          >
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full h-auto object-cover"
              />
            )}
            <div className="p-1">
              <div className="hidden md:block">
                <p className="text-sm">{post.caption || "No caption"}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                — {post.author?.username || "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsFeed;
