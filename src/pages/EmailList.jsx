import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const EmailList = ({ onUserClick, selectedUser, messages = [] }) => {
    const [users, setUsers] = useState([]);
    const [shuffledUsers, setShuffledUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [fetchedMessages, setFetchedMessages] = useState([]);
    const [loading, setLoading] = useState(true); // Yuklanish holatini qo'shish
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchMessages();
    }, [loggedInUser]);

    useEffect(() => {
        fetchUsers();
    }, [fetchedMessages]);

    const fetchMessages = () => {
        if (!loggedInUser) return;

        axios.get('http://localhost:5001/messages')
            .then(response => {
                setFetchedMessages(response.data);
            })
            .catch(error => console.error("Error fetching messages:", error));
    };

    const fetchUsers = () => {
        axios.get('http://localhost:5001/users')
            .then(response => {
                const filteredUsers = response.data.filter(user =>
                    user.email !== loggedInUser.email &&
                    fetchedMessages.some(msg =>
                        (msg.sender === user.email && msg.receiver === loggedInUser.email) ||
                        (msg.sender === loggedInUser.email && msg.receiver === user.email)
                    )
                );
                setUsers(filteredUsers);
                setShuffledUsers(filteredUsers);
                setLoading(false); // Foydalanuvchilar yuklangandan keyin loading holatini o'zgartirish
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setLoading(false); // Xatolik bo'lganda ham loading holatini o'zgartirish
            });
    };

    const getFilteredUsers = () => {
        return searchQuery
            ? users.filter(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()))
            : users;
    };

    const handleUserClick = (user) => {
        onUserClick(user);
        shuffleUsers();
    };

    const shuffleUsers = () => {
        const shuffled = [...users].sort(() => Math.random() - 0.5);
        setShuffledUsers(shuffled);
    };

    const handleBack = () => {
        navigate("/home"); // Use navigate to go back
    };

    return (
        <div className="md:w-1/3 w-full border-r border-gray-300 bg-gray-900 flex flex-col">
          <div className=' flex items-center justify-start'>
          <button onClick={handleBack} className="text-2xl  text-white ml-4">←</button>

<h3 className="text-lg font-semibold p-4  border-gray-200 text-blue-600">Chat</h3>

          </div>
            <input
                type="text"
                placeholder="Search..."
                className="p-2 m-4 rounded-full border border-gray-400 bg-gray-800 text-white placeholder-gray-300 placeholder:font-bold px-5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex-grow overflow-y-auto">

                {loading ? ( // Yuklanish holatini ko'rsatish
                    <div className="animate-pulse">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center py-3 px-4 bg-gray-700 text-white">
                                <div className="rounded-full bg-gray-600 h-8 w-8 mr-2"></div>
                                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    getFilteredUsers().map(user => (
                        <div
                            key={user.email}
                            className={`flex items-center py-3 px-4 cursor-pointer transition-colors duration-200 ease-in-out 
                            ${selectedUser === user.email ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 text-white'}`}
                            onClick={() => handleUserClick(user)}
                        >
                            <FaUserCircle className="text-gray-400 mr-2 text-2xl" />
                            <span className="font-medium">{user.email}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmailList;
