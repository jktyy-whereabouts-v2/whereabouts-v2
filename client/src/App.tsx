import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import StartPage from './components/pages/StartPage';
import Login from './components/pages/Login';
import Registration from './components/pages/Registration';
import Dashboard from './components/pages/Dashboard';
import ChatPage from './components/ChatPage';

function App() {
	interface User {
		name: string;
		phone_number: string;
		password: string;
	}

	const [userInfo, setUserInfo] = useState<User>({
		name: '',
		phone_number: '',
		password: '',
	});

	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<StartPage userInfo={userInfo} setUserInfo={setUserInfo} />} />
					<Route path="/login" element={<Login userInfo={userInfo} setUserInfo={setUserInfo} />} />
					<Route path="/register" element={<Registration userInfo={userInfo} setUserInfo={setUserInfo} />} />
					<Route path="/dashboard" element={<Dashboard userInfo={userInfo} setUserInfo={setUserInfo} />} />
					<Route path="/chat" element={<ChatPage userInfo={userInfo} />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
