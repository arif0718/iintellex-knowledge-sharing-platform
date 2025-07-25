import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send, UserRound } from "lucide-react";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [bookmarked, setBookmarked] = useState(
    !!user?.Bookmarks?.includes(post._id) || false
  );
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setComment(post.comments);
    }
  }, [post]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // after refresing the page like data get lost so we have to updata store
        const updatedpostData = posts.map((p) =>
          p._id == post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
            : p
        );
        dispatch(setPosts(updatedpostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/comment`,
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
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedpostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id != post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setBookmarked(!bookmarked);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="break-inside-avoid md:my-4 bg-white shadow-md rounded-lg overflow-hidden flex flex-col mb-2">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Link
            key={post.author?._id}
            to={`/profile/${post.author?._id}`}
            className="flex items-center gap-3 rounded-md"
          >
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} alt="post-image" />
              <AvatarFallback><UserRound /></AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold">{post.author?.username}</h1>
              {user?._id === post.author._id && (
                <Badge variant="secondary">Author</Badge>
              )}
            </div>
          </Link>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {user && user?._id == post?.author._id && (
              <Button
                onClick={deleteHandler}
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full mx-auto p-2">
        {post.image && (
          <img
            className="rounded-sm my-2 w-full object-cover
               min-h-[420px] max-h-[450px]  // for mobile
               md:min-h-[420px] md:max-h-[540px] 
               md:w-[420px] md:min-w-[260px] md:max-w-[480px]"
            src={post.image}
            alt="post_img"
          />
        )}
      </div>


      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={"24"}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={"22px"}
                className="cursor-pointer hover:text-gray-600"
              />
            )}

            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            {/* <Send className="cursor-pointer hover:text-gray-600" /> */}
          </div>
          <button onClick={bookmarkHandler}>
            {bookmarked ? (
              <BookmarkSolid className="w-6 h-6  text-black " />
            ) : (
              <BookmarkOutline className="w-6 h-6 text-black " />
            )}
          </button>
        </div>

        <span className="font-medium block mb-2 text-sm md:text-base">{postLike} likes</span>
        <p className="text-sm break-words max-w-[400px]">
          <span className="font-medium mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer text-xs md:text-sm text-gray-400"
          >
            View all {comment.length} comments
          </span>
        )}
        <CommentDialog open={open} setOpen={setOpen} />

        <div className="flex items-center justify-between mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none text-xs md:text-sm w-full"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-[#3BADF8] cursor-pointer text-xs md:text-base"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
