import {
  Home,
  LogOut,
  UserRound,
  Menu,
  X,
  UserRoundSearch,
  ChartNoAxesCombined,
  MessageSquareText,
  Bell,
  Upload,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { clearLikeNotification } from "@/redux/rtnSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logouthandler();
    } else if (textType === "Upload") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Connect") {
      navigate("/chat");
    } else if (textType === "Search") {
      navigate("/", { state: { focusSearch: true } });
    } else if (textType === "Insights") {
      navigate("/insights");
    }
    setSidebarOpen(false);
  };

  const SidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <UserRoundSearch />, text: "Search" },
    { icon: <ChartNoAxesCombined />, text: "Insights" },
    { icon: <MessageSquareText />, text: "Connect" },
    { icon: <Bell />, text: "Updates" },
    { icon: <Upload />, text: "Upload" },
    {
      icon: (
        <Avatar className="w-8 h-8 ">
          <AvatarImage src={user?.profilePicture} alt="@user" />
          <AvatarFallback><UserRound /></AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}

      <div className="md:hidden top-9 right-4 z-40">
        {sidebarOpen ? (
          <X
            className="h-8 w-8 mt-1 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        ) : (
          <Menu
            className="h-8 w-8 mt-1 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </div>

      <div
        className={`
          fixed z-30 top-0 h-screen w-[72%] md:w-[18%] px-4 transition-transform duration-300 
          backdrop-blur-lg bg-white/30 md:bg-white md:backdrop-blur-none 
          border-l md:border-r border-gray-300 bg-gradient-to-b from-white to-[#4a6d95]
          ${sidebarOpen ? "translate-x-0 right-0" : "translate-x-full top-16 right-0"} 
          md:translate-x-0 md:top-0 md:left-0
        `}
      >
        <div className="flex flex-col pt-16 md:pt-10">
          <div className="hidden md:flex items-center mb-8">
            <img src="/iintellex-logo.png" alt="logo" className="w-45" />
          </div>

          {SidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-2"
            >
              {item.icon}
              <span>{item.text}</span>

              {item.text === "Updates" && likeNotification.length > 0 && (
                <Popover
                  open={popoverOpen}
                  onOpenChange={(open) => {
                    if (!open && popoverOpen) {
                      dispatch(clearLikeNotification());
                    }
                    setPopoverOpen(open);
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="">
                      {likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-2"
                        >
                          <Avatar>
                            <AvatarImage
                              src={notification.userDetails?.profilePicture}
                            />
                            <AvatarFallback><UserRound /></AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>

        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default LeftSidebar;
