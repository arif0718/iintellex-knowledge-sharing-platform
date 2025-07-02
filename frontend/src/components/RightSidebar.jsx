import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { UserRound } from 'lucide-react';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className="hidden md:block max-w-[360px] min-w-[250px] w-full my-10 px-5 pr-10 ">
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback><UserRound /></AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar