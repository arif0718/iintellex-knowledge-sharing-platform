import React, { useEffect, useRef, useState } from "react";
import Posts from "./Posts";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const Feed = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null); // input focus

  // Focus input if navigated from sidebar
  useEffect(() => {
    if (location?.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      // clear state so it's not triggered again on back
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchUsers = async () => {
        if (!search) {
          setSearchResults([]);
          return;
        }

        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user/search?q=${search}`,
            { withCredentials: true }
          );
          if (res.data.success) {
            setSearchResults(res.data.users);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 mt-8 flex flex-col items-center sm:pl-[20%] relative">

      {/* Mobile:logo + search */}
      <div className="md:hidden flex">

        <div className="md:hidden flex items-center justify-between w-full px-4 ">
          <div className="z-40">
            <img src="/iintellex-logo.png" alt="logo" className="w-20 mb-4" />
          </div>

          <div ref={searchBoxRef} className="  w-[70%] relative">
            <SearchBar
              search={search}
              setSearch={setSearch}
              inputRef={searchInputRef}
            />

            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full z-10 bg-white border rounded-md shadow-lg">
                <SearchResults users={searchResults} />
              </div>
            )}
          </div>
        </div>
        <LeftSidebar />
      </div>

      {/* Desktop: search bar */}
      <div
        ref={searchBoxRef}
        className="hidden md:flex self-center w-[70%] relative"
      >
        <SearchBar
          search={search}
          setSearch={setSearch}
          inputRef={searchInputRef}
        />

        {searchResults.length > 0 && (
          <div className="absolute top-full mt-1 w-full z-10 bg-white border rounded-md shadow-lg">
            <SearchResults users={searchResults} />
          </div>
        )}
      </div>

      <div
        className={`${searchResults.length > 0 ? "opacity-30 pointer-events-none" : ""
          }`}
      >
        <Posts />
      </div>
    </div>

  );
};

export default Feed;
