import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null);

    const clearMessage = () => {
        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Forma avtomatik yuborilishidan saqlaydi
        if (isSignUp) {
            await handleSignUp();
        } else {
            await handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const { data: users } = await axios.get('http://localhost:5001/users');
            const user = users.find(v => v.email === email && v.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                navigate('/messenger');
                return;
            }

            setMessage('User not found.');
            clearMessage();
        } catch (error) {
            console.error('Error:', error);
            setMessage('Network error. Please try again.');
            clearMessage();
        }
    };

    const handleSignUp = async () => {
        try {
            const { data: users } = await axios.get('http://localhost:5001/users');
            const existingUser = users.find(v => v.email === email);

            if (existingUser) {
                setMessage('Email already in use.');
                clearMessage();
                return;
            }

            const response = await axios.post('http://localhost:5001/users', { email, password });

            if (response.status === 201) {
                setMessage('Account created successfully.');
                clearMessage();
                setIsSignUp(false);
                setEmail('');
                setPassword('');
            } else {
                setMessage('Error creating account.');
                clearMessage();
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Network error. Please try again.');
            clearMessage();
        }
    };

    const toggleForm = () => {
        setIsSignUp(prevState => !prevState);
        setEmail('');
        setPassword('');
        setMessage('');
    };

    return (
        <div ref={formRef} className="flex items-center justify-center md:mr-64 min-h-screen bg-white">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {message && (
                    <p className={`block mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                <button
                    type="submit"
                    className={`w-full ${isSignUp ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>

                <div className='flex gap-2 mt-6 justify-center'>
                    <p>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</p>
                    <button
                        type="button"
                        onClick={toggleForm}
                        className='text-blue-600'>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
