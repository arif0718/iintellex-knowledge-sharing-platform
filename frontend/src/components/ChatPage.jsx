import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, UserRound } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import LeftSidebar from './LeftSidebar';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            // http://localhost:8000/ => http://localhost:8000/ 
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div>
            <div className="flex ml-0 md:ml-[18%] h-screen">
                {/* Sidebar: Only show on desktop or if no user selected on mobile */}
                <section
                    className={`w-full md:w-1/4 mt-8 h-[80vh] ${selectedUser ? 'hidden md:block' : 'block'}`}
                >
                    {/* Mobile: logo + sidebar only on mobile, not on desktop */}
                    <div className="md:hidden flex">
                        <div className="md:hidden flex items-center justify-between w-full px-4 ">
                            <div className="z-40">
                                <img src="/iintellex-logo.png" alt="logo" className="w-20 mb-4" />
                            </div>
                        </div>
                        <LeftSidebar />
                    </div>
                    <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
                    <hr className="mb-4 border-gray-300" />
                    <div className="overflow-y-auto h-[77vh] md:h-[87vh] hide-scrollbar">
                        {suggestedUsers.map((suggestedUser) => {
                            if (!suggestedUser?._id) return null;
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div
                                    key={suggestedUser._id}
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                    className="flex gap-3 border-2 rounded-lg m-4 items-center p-1 hover:bg-gray-200 cursor-pointer"
                                >
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>
                                            <UserRound />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{suggestedUser?.username}</span>
                                        <span
                                            className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {isOnline ? 'online' : 'offline'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Chat area: Only show on desktop or if user selected on mobile */}
                <div
                    className={`w-full md:w-3/4 h-screen ${!selectedUser ? 'hidden md:block' : 'block'}`}
                >
                    {selectedUser ? (
                        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
                            <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                                <Avatar>
                                    <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                                    <AvatarFallback>
                                        <UserRound />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span>{selectedUser?.username}</span>
                                </div>
                            </div>
                            <Messages selectedUser={selectedUser} />
                            <div className="flex items-center p-4 border-t border-t-gray-300">
                                <Input
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            sendMessageHandler(selectedUser?._id);
                                        }
                                    }}
                                    type="text"
                                    className="flex-1 mr-2 focus-visible:ring-transparent"
                                    placeholder="Messages..."
                                />
                                <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
                                    Send
                                </Button>
                            </div>
                        </section>
                    ) : (
                        <div className="flex flex-col border-l items-center justify-center min-h-screen text-center">
                            <MessageCircleCode className="w-32 h-32 my-4" />
                            <h1 className="font-medium text-lg">Your messages</h1>
                            <span className="text-sm text-gray-600">
                                Send a message to start a chat.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatPage