import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";

const SuggestedUsers = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    // Track follow state and loading for each user
    const [followedMap, setFollowedMap] = useState({});
    const [loadingMap, setLoadingMap] = useState({});

    // Keep followedMap in sync with suggestedUsers and user
    React.useEffect(() => {
        const map = {};
        suggestedUsers.forEach(u => {
            map[u._id] = u.followers?.includes(user?._id) || false;
        });
        setFollowedMap(map);
    }, [suggestedUsers, user?._id]);

    const followUnfollowHandler = async (suggestedUser) => {
        setLoadingMap(prev => ({ ...prev, [suggestedUser._id]: true }));
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/user/followorunfollow/${suggestedUser._id}`,
                {},
                { withCredentials: true }
            );
            if (res.data.success) {
                setFollowedMap(prev => ({
                    ...prev,
                    [suggestedUser._id]: !prev[suggestedUser._id]
                }));
                // Optionally update Redux userProfile if needed
                // dispatch(setUserProfile(...))
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoadingMap(prev => ({ ...prev, [suggestedUser._id]: false }));
        }
    };

    return (
        <div className="my-10 ">
            <div className="flex items-center justify-between text-sm gap-8">
                <h1 className="font-semibold text-gray-600">Professionals You May Know</h1>
                {/* <span className="font-medium cursor-pointer">See All</span> */}
            </div>
            {
                suggestedUsers.slice(0, 7).map((user) => {
                    const isFollowed = followedMap[user._id];
                    const isLoading = loadingMap[user._id];
                    return (
                        <div key={user._id} className='flex items-center justify-between gap-10 my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post_image" />
                                        <AvatarFallback><UserRound /></AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <Button
                                className={`text-white bg-[#1b3140] text-[10px] font-bold h-[24px] px-3 rounded cursor-pointer hover:text-[#3BADF8] ${isFollowed ? 'bg-gray-400 text-black hover:text-white' : ''}`}
                                onClick={() => followUnfollowHandler(user)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Please wait...' : isFollowed ? 'Unfollow' : 'Follow'}
                            </Button>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default SuggestedUsers;
