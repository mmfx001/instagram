import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AiFillHome, 
  AiOutlineSearch, 
  AiOutlineCompass, 
  AiOutlineMessage, 
  AiOutlineHeart, 
  AiOutlinePlusSquare, 
  AiOutlineUser, 
  AiOutlineEllipsis // "More" uchun ikonka
} from 'react-icons/ai';

const Sidebar = () => {
  return (
    <div className="fixed w-64 h-screen p-4 bg-white shadow-lg flex flex-col overflow-y-auto">
      <Link to="/home" className="text-3xl font-bold mb-8 text-black">
        Instagram
      </Link>
      <nav className="flex flex-col space-y-6 flex-grow">
        <Link to="/home" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiFillHome size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineSearch size={24} />
          <span>Search</span>
        </Link>
        <Link to="/explore" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineCompass size={24} />
          <span>Explore</span>
        </Link>
        <Link to="/messages" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineMessage size={24} />
          <span>Messages</span>
        </Link>
        <Link to="/notifications" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineHeart size={24} />
          <span>Notifications</span>
        </Link>
        <Link to="/create" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlinePlusSquare size={24} />
          <span>Create</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineUser size={24} />
          <span>Profile</span>
        </Link>
      </nav>
      <div className="mt-auto">
        <Link to="/more" className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 focus:text-blue-500">
          <AiOutlineEllipsis size={24} />
          <span>More</span>
        </Link>
      </div>

    </div>
  );
};

export default Sidebar;
