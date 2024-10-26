import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineCompass,
  AiOutlineMessage,
  AiOutlineHeart,
  AiOutlinePlusSquare,
  AiOutlineUser,
  AiOutlineEllipsis
} from 'react-icons/ai';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="fixed bottom-0 w-full h-16 bg-white shadow-lg flex md:flex-col md:w-64 md:h-screen md:top-0
                 md:left-0 md:border-r border-gray-300 overflow-y-auto p-4 space-x-4 md:space-x-0 md:space-y-6"
    >
      <Link to="/home" className="text-xl font-bold mb-4 text-black md:text-3xl hidden md:block">
        Instagram
      </Link>
      <nav className="flex justify-around md:flex-col md:flex md:justify-normal md:space-y-6 flex-grow ">
        <Link to="/home" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500">
          <AiFillHome size={24} />
          <span className="hidden md:inline">Home</span>
        </Link>
        <Link to="/search" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineSearch size={24} />
          <span className="hidden md:inline">Search</span>
        </Link>
        <Link to="/explore" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500 hidden md:flex">
          <AiOutlineCompass size={24} />
          <span className="hidden md:inline">Explore</span>
        </Link>
        <Link to="/messages" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500 hidden md:flex">
          <AiOutlineMessage size={24} />
          <span className="hidden md:inline">Messages</span>
        </Link>
        <Link to="/notifications" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineHeart size={24} />
          <span className="hidden md:inline">Notifications</span>
        </Link>
        <Link to="/create" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlinePlusSquare size={24} />
          <span className="hidden md:inline">Create</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-1 md:space-x-4 text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineUser size={24} />
          <span className="hidden md:inline">Profile</span>
        </Link>
      </nav>
      <div className="mt-auto">
        <div className={`dropdown ${isOpen ? 'dropdown-open' : ''} dropdown-top`}>
          <div
            className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 cursor-pointer"
            onClick={toggleDropdown}
          >
            <AiOutlineEllipsis size={24} />
            <span className="hidden md:inline">More</span>
          </div>
          {isOpen && (
            <ul className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow z-10">
              <Link to="/settings">
                <li><a onClick={closeDropdown}>Settings</a></li>
              </Link>
              <Link to="/actions">
                <li><a onClick={closeDropdown}>Your actions</a></li>
              </Link>
              <Link to="/saved">
                <li><a onClick={closeDropdown}>Saved</a></li>
              </Link>
              <Link to="/problem">
                <li><a onClick={closeDropdown}>Report a problem</a></li>
              </Link>
              <Link to="/switching">
                <li><a onClick={closeDropdown}>Switching account</a></li>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
