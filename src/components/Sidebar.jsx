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
  AiOutlineEllipsis // "More" uchun ikonka
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
        <div className={`dropdown ${isOpen ? 'dropdown-open' : ''} dropdown-top`}>
          <div
            className="flex items-center space-x-4 text-lg text-black hover:text-blue-500 cursor-pointer"
            onClick={toggleDropdown}
          >
            <AiOutlineEllipsis size={24} />
            <span>More</span>
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