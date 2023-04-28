import React, { useState, useEffect } from 'react';
import { User, UserProps } from '../types';
import { Box, styled, Typography, Stack, CssBaseline, InputBase } from '@mui/material';
import { Container } from '@mui/system';
import Sidebar from '../Sidebar';
import Divider from '@mui/material/Divider';

interface DashboardProps {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	logout: Function;
	setContacts: React.Dispatch<React.SetStateAction<any>>
}

function Dashboard({ userInfo, setUserInfo, logout, setContacts}: DashboardProps) {
	useEffect(() => {
		setUserInfo(JSON.parse(localStorage.getItem('user') || ''));
	}, []);

	return (
		<>
			<Divider sx={{ width: '85%', margin: 'auto' }} variant="middle"></Divider>
			<CssBaseline />
			<Box sx={{ display: 'flex', mt: '30px' }}>
				<Container sx={{ width: '40%', ml: '30px' }}>
					<Sidebar logout={logout} />
				</Container>
				<Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px' }}>
					<Typography sx={{ fontSize: '24px' }}>Hello Dashboard</Typography>
				</Container>
			</Box>
		</>
	);
}

export default Dashboard;

// {/* <div className="dashboard-container">
// {/* SSE - Render trips */}
// {/* <div>
//   {trips.map((trip) => (
//     <div>Trip Id: {trip.id} | Trip Start Time: {trip.start_timestamp} ||</div>
//   ))}
// </div> */}
// <div className="sidebar-container">
//   <Sidebar logout={logout} />
// </div>
// </div> */}
