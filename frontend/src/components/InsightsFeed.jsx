import React from "react";
import useGetAllPost from "@/hooks/useGetAllPost";
import { useSelector } from "react-redux";

const InsightsFeed = () => {
  useGetAllPost(); // Fetches all posts using Redux
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="pl-[5%] pr-[5%] pt-8 min-h-screen bg-gray-50">
      {/* Responsive columns: 1 on extra small, 2 on small, 3 on md, 4 on lg */}
      <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="break-inside-avoid mb-4 bg-white shadow-md rounded-lg overflow-hidden"
          >
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full h-auto object-cover"
              />
            )}
            <div className="p-3">
              <p className="text-sm">{post.caption || "No caption"}</p>
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
