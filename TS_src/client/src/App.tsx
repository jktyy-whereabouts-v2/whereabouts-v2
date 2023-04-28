import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import StartPage from './components/pages/StartPage';
import Login from './components/pages/Login';
import Registration from './components/pages/Registration';
import Dashboard from './components/pages/Dashboard';
import ChatPage from './components/ChatPage';
import { User, Trip } from './components/types';
import { Toaster } from 'react-hot-toast';
import Contacts from './components/Contacts';
import MyTripCard from './components/MyTripCard';
import TripImWatching from './components/TripImWatching';

function App() {
	const [contacts, setContacts] = useState<any>([]);

	// hook for conditionally rendering components
	const [activeComponent, setActiveComponent] = useState('');

	// toggle components in sidebar
	const handleClick = (componentName: string) => {
		setActiveComponent(componentName);
	};

	const [userTrip, setUserTrip] = useState<Trip>({
		active: true,
		id: '',
		sos_lat: '',
		sos_lng: '',
		sos_timestamp: '',
		start_timestamp: '',
		end_timestamp: '',
		start_lat: '',
		start_lng: '',
		trips_id: null,
		user_is_traveler: null,
		user_phone_number: null,
	});

	const [userInfo, setUserInfo] = useState<User>({
		name: '',
		phone_number: '',
		password: '',
	});

	const login = (userData: any) => {
		console.log(userData);
		setUserInfo({
			name: userData.name,
			phone_number: userData.phone_number,
			password: userData.password,
		});
		localStorage.setItem('user', JSON.stringify(userData));
		console.log('logged in confirmed');
	};

	const logout = () => {
		setUserInfo({ name: '', phone_number: '', password: '' });
		setUserTrip({
			active: false,
			id: '',
			sos_lat: '',
			sos_lng: '',
			sos_timestamp: '',
			start_timestamp: '',
			end_timestamp: '',
			start_lat: '',
			start_lng: '',
			trips_id: null,
			user_is_traveler: null,
			user_phone_number: null,
		});
		localStorage.clear();
		console.log('logged out confirmed');
	};

	// initially receiving user's contact list from the database

	useEffect(() => {
		if (!JSON.parse(localStorage.getItem('user'))) {
			localStorage.setItem('user', JSON.stringify(userInfo));
		}
		setUserInfo(JSON.parse(localStorage.getItem('user')));
	}, []);

	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<StartPage userInfo={userInfo} setUserInfo={setUserInfo} login={login} />} />
					<Route path="/login" element={<Login userInfo={userInfo} setUserInfo={setUserInfo} login={login} />} />
					<Route path="/register" element={<Registration userInfo={userInfo} setUserInfo={setUserInfo} login={login} />} />
					<Route path="/dashboard" element={<Dashboard userInfo={userInfo} setUserInfo={setUserInfo} logout={logout} setContacts={setContacts} />} />
					<Route path="/chat" element={<ChatPage userInfo={userInfo} contacts={contacts} setContacts={setContacts} logout={logout}/>} />
					<Route
						path="/contacts"
						element={
							<Contacts userInfo={userInfo} contacts={contacts} setContacts={setContacts} setActiveComponent={setActiveComponent} setUserTrip={setUserTrip} logout={logout} />
						}
					/>
					<Route path="/myTrip" element={<MyTripCard userInfo={userInfo} setUserInfo={setUserInfo} userTrip={userTrip} setUserTrip={setUserTrip} logout={logout} />} />
					<Route path="/trips" element={<TripImWatching userInfo={userInfo} logout={logout} />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}

export default App;
