import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";

const SearchResults = ({ users }) => {
  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <Link
          key={user._id}
          to={`/profile/${user._id}`}
          className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePicture} alt={user.username} />
            <AvatarFallback><UserRound /></AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.username}</span>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
