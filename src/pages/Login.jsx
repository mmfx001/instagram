import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // defolt parol jonkam 
    if (username === "admin" && password === "admin") {
      // local storage baby
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      // Navigatsiya home page ga
      navigate("/home");
    } else {
      alert("Login yoki parol xato!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 border border-gray-300 rounded-lg shadow-lg bg-white mx-4 md:mx-0">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Instagram</h1>

        <form onSubmit={handleLogin} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Телефон, имя пользователя или эл. адрес"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Войти
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <span className="border-t border-gray-300 w-full"></span>
          <span className="text-gray-400 px-2">или</span>
          <span className="border-t border-gray-300 w-full"></span>
        </div>

        <div className="text-center mt-4">
          <button className="text-blue-800 font-semibold">
            Войти через Facebook
          </button>
        </div>

        <div className="text-center mt-4">
          <button className="text-sm text-blue-800">Забыли пароль?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;