import React from "react";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Bu yerda chiqish funksiyasini qo'shishingiz mumkin
    navigate('/login'); // Agar log out funksiyasini bajarish kerak bo'lsa
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Log Out Button */}
      <div className="flex justify-center items-center h-full text-2xl font-bold">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
