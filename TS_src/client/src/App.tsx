import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import StartPage from './components/pages/StartPage';
import Login from './components/pages/Login';
import Registration from './components/pages/Registration';
import Dashboard from './components/pages/Dashboard';
import ChatPage from './components/ChatPage';
import { User } from './components/types';
import socket from './main';
import toast, { Toaster } from 'react-hot-toast';

function App() {
	const [userInfo, setUserInfo] = useState<User>({
		name: '',
		phone_number: '',
		password: '',
	});

	const login = (userData: any) => {
		setUserInfo({ name: userInfo.name, phone_number: userInfo.phone_number, password: userInfo.password });
		localStorage.setItem('user', JSON.stringify(userInfo));
		console.log('logged in confirmed');
	};

	return (
		<>
			<Router>
				{/* <Header /> */}
				<Routes>
					<Route path="/" element={<StartPage userInfo={userInfo} setUserInfo={setUserInfo} login={login} />} />
					<Route path="/login" element={<Login userInfo={userInfo} setUserInfo={setUserInfo} login={login} />} />
					<Route path="/register" element={<Registration userInfo={userInfo} setUserInfo={setUserInfo} login={login} />} />
					<Route path="/dashboard" element={<Dashboard userInfo={userInfo} setUserInfo={setUserInfo} />} />
					<Route path="/chat" element={<ChatPage userInfo={userInfo} setUserInfo={setUserInfo} path="/chat" socket={socket} />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}

export default App;
