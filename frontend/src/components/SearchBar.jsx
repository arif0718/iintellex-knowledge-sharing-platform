import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ search, setSearch, inputRef }) => {
  return (
    <div className="relative w-[100%] mb-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search users by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
        <Search size={20} />
      </span>
    </div>
  );
};

export default SearchBar;
