import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Create from './pages/Create';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Actions from './pages/actions';
import Saved from './pages/saved';
import Problem from './pages/Problem';
import Switching from './pages/Switching';
import Messenger from './pages/Messages';


const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};
const Main = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className={`flex flex-col md:flex-row  min-h-screen`}>
      {!isLoginPage && (
        <div
          className={`w-full md:w-64 ${isLoginPage ? 'hidden' : 'block'} 
                      md:fixed md:left-0 md:top-0 md:h-screen border-r border-gray-300
                      md:flex md:flex-col bg-white md:pb-0 `}
        >
          <Sidebar />
        </div>
      )}
      <div
        className={`flex-1 md:mb-0 mb-16 ml-0 md:ml-64 ${isLoginPage ? 'flex justify-center items-center' : 'mt-0'}`}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messenger />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/problem" element={<Problem />} />
          <Route path="/switching" element={<Switching />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
