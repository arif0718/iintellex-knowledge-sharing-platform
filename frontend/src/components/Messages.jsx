import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'
import { UserRound } from 'lucide-react'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    return (
        <div className='overflow-y-auto flex-1 p-4 hide-scrollbar'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center mb-8'>
                    <Avatar className="h-25 w-25">
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback><UserRound /></AvatarFallback>
                    </Avatar>
                    <span className='font-bold'>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2 cursor-pointer bg-[#101e50] text-white hover:bg-gray-400 hover:text-black" variant="secondary">Visit profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages
                        .filter(msg => msg.message !== "__start__")
                        .map((msg) => {
                            return (
                                <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-gray-200 text-black' : 'bg-[#4f63ac] text-white'}`}>
                                        {msg.message}
                                    </div>
                                </div>
                            )
                        })
                }

            </div>
        </div>
    )
}

export default Messages