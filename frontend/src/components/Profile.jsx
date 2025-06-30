import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { FaComment, FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";
import { UserRound } from "lucide-react";
import LeftSidebar from "./LeftSidebar";

const Profile = () => {
  const params = useParams(); //use when we have to data from url
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [followed, setFollowed] = useState(
    userProfile?.followers.includes(user?._id) || false
  );
  const [followers, setFollowers] = useState(
    userProfile?.followers?.length || 0
  );
  const dispatch = useDispatch();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const followUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedfollowers = followed ? followers - 1 : followers + 1;
        setFollowers(updatedfollowers);
        setFollowed(!followed);

        // Update followers in userProfile object
        const updatedUserProfile = {
          ...userProfile,
          followers: followed
            ? userProfile.followers.filter((id) => id !== user._id)
            : [...userProfile.followers, user._id],
        };

        dispatch(setUserProfile(updatedUserProfile)); // update Redux
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFollowed(userProfile?.followers?.includes(user?._id) || false);
  }, [userProfile, user?._id]);

  return (
    <div className="mt-8">
<div className="md:hidden flex">
        <div className="md:hidden flex items-center justify-between w-full px-4 ">
          <div className="z-40">
            <img src="/iintellex-logo.png" alt="logo" className="w-20 mb-4" />
          </div>
        </div>
        <LeftSidebar />
      </div>
    <div className="flex max-w-5xl justify-center mx-auto px-2 md:pl-10">
      <div className="flex flex-col gap-10 md:gap-20 p-2 sm:p-4 md:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <section className="flex items-center justify-center mb-4 md:mb-0">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback><UserRound /></AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                <span className="block w-full text-center sm:w-auto text-lg sm:text-xl font-semibold">
                  {userProfile?.username}
                </span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8 text-xs sm:text-sm"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8 text-xs sm:text-sm"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8 text-xs sm:text-sm"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : followed ? (
                  <>
                    <Button
                      onClick={followUnfollowHandler}
                      variant="secondary"
                      className="h-8 cursor-pointer text-xs sm:text-sm"
                    >
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8 cursor-pointer text-xs sm:text-sm">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={followUnfollowHandler}
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8 cursor-pointer text-xs sm:text-sm"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-10 md:gap-4 text-sm sm:text-base">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">{followers} </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">{userProfile?.following.length} </span>
                  following
                </p>
              </div>
                <span className="ml-8 md:ml-0 text-sm sm:text-base">
                  {userProfile?.bio || "bio here..."}
                </span>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm">
            <span
              className={`py-3 cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-sm my-2 w-full aspect-square">
                    <div className="flex items-center text-white space-x-4 cursor-pointer">
                      <button className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
                        <FaHeart size={18} className="text-white sm:text-xl" />
                        <span className="text-base sm:text-xl font-bold">
                          {post?.likes.length}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 cursor-pointer">
                        <FaComment size={18} className="text-white sm:text-xl" />
                        <span className="text-base sm:text-xl font-bold">
                          {post?.comments.length}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
