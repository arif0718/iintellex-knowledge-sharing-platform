import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal, UserRound } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { toast } from "sonner";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if(selectedPost){
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deleteSelectedPostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/post/delete/${selectedPost?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id != selectedPost?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedpostData = posts.map((p) =>
          p._id === selectedPost?._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedpostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-0 flex flex-col max-w-full w-full sm:max-w-2xl md:min-w-[700px] md:max-w-4xl"
      >
        <div className="flex flex-col md:flex-row flex-1 ">
          <div className="w-full md:w-1/2 max-h-72 md:max-h-none">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-60 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f0e4e4] to-[#bdd6f2] border-b border-gray-300">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback><UserRound /></AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs ">
                    {selectedPost?.author?.username}{" "}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  {selectedPost?.author?._id !== user?._id && (
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-fit text-[#ED4956] font-bold"
                    >
                      Unfollow
                    </Button>
                  )}
                  <Button variant="ghost" className="cursor-pointer w-fit ">
                    Add to favorites
                  </Button>
                  {user && user?._id == selectedPost?.author._id && (
                    <Button
                      onClick={deleteSelectedPostHandler}
                      variant="ghost"
                      className="cursor-pointer w-fit "
                    >
                      Delete
                    </Button>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            {/* Comments */}
            <div className="flex-1 overflow-y-auto max-h-40 md:max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            {/* Input */}
            <div className="border-t border-gray-300 p-4 bg-gradient-to-r from-[#f0e4e4] to-[#bdd6f2]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded-md bg-white"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                  className="cursor-pointer bg-[#101e50] text-white hover:bg-gray-400 hover:text-black"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
