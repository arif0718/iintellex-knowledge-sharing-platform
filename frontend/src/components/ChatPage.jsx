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
    const [involvedUser, setInvolvedUser] = useState([]);
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/message/send/${receiverId}`, { textMessage }, {
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

    const conversationUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/message/conversations/${user._id}`, { withCredentials: true });
            if (res.data.success) {
                setInvolvedUser(res.data.results);
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        conversationUsers()

        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className="flex ml-0 md:ml-[18%] h-screen bg-gradient-to-r from-[#f0e4e4] to-[#bdd6f2]">
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
                <h1 className="font-bold mb-4 px-3 text-xl ">{user?.username}</h1>
                <hr className="mb-4 border border-gray-300 shadow-md" />
                <div className="overflow-y-auto h-[77vh] md:h-[87vh] hide-scrollbar  ">
                    {
                        involvedUser && involvedUser.map((msg) => {
                            const chatUserData = suggestedUsers.find((u) => u._id === msg);
                            const isOnline = onlineUsers.includes(chatUserData?._id);

                            return (
                                <div
                                    key={chatUserData._id}
                                    onClick={() => dispatch(setSelectedUser(chatUserData))}
                                    className="flex gap-3 rounded-lg m-4 items-center p-1 bg-gray-200 shadow-md hover:bg-[#d4dfea] cursor-pointer"
                                >
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={chatUserData.profilePicture} />
                                        <AvatarFallback><UserRound /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{chatUserData.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
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
                        <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky shadow-sm">
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                                <AvatarFallback>
                                    <UserRound />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col font-bold">
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className="flex items-center p-4 border-t border-t-[#b9c0cc] ">
                            <Input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessageHandler(selectedUser?._id);
                                    }
                                }}
                                type="text"
                                className="flex-1 mr-2 focus-visible:ring-transparent shadow-lg "
                                placeholder="Messages..."
                            />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
                                Send
                            </Button>
                        </div>
                    </section>
                ) : (
                    <div className="flex flex-col border-l border-l-gray-300 shadow-md items-center justify-center min-h-screen text-center">
                        <MessageCircleCode className="w-32 h-32 my-4" />
                        <h1 className="font-medium text-lg">Conversations</h1>
                        <span className="text-sm text-gray-600">
                            Send your first message and spark a conversation.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage