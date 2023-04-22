import React from 'react';
import { Box, styled, Typography, Stack, CssBaseline, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';

interface Props {
	handleClick: (componentName: any) => any;
}

function Sidebar({ logout }: any) {
	const navigate = useNavigate();

	const menuList = [
		{
			text: 'Contacts',
			path: '/contacts',
			icon: <PeopleIcon />,
		},
		{
			text: 'My Trip',
			path: '/myTrip',
			icon: <DriveEtaIcon />,
		},
		{
			text: `Trips I'm Watching`,
			path: '/trips',
			icon: <ModeOfTravelIcon />,
		},
		{
			text: 'Chat',
			path: '/chat',
			icon: <ChatIcon />,
		},
	];

	return (
		<>
			<Box ml={7.5} sx={{ display: { xs: 'none', sm: 'block' } }}>
				<List>
					{menuList.map((item) => (
						<ListItem disablePadding key={item.text} onClick={() => navigate(item.path)}>
							<ListItemButton>
								<ListItemIcon>{item.icon}</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItemButton>
						</ListItem>
					))}
					<Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
						<ListItem disablePadding key="Log Out" onClick={logout}>
							<ListItemButton>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary="Log Out" />
							</ListItemButton>
						</ListItem>
					</Link>
				</List>
			</Box>
		</>
	);
}
export default Sidebar;

{
	/* <div className="sidebar">
<div onClick={() => handleClick('contacts')} className="sidebar-item">
  Contacts
</div>
<div onClick={() => handleClick('myTripCard')} className="sidebar-item">
  My Trip
</div>
<div onClick={() => handleClick('tripsImWatching')} className="sidebar-item">
  Trips I'm Watching
</div>
<Link to="/chat" style={{ textDecoration: 'none' }}>
  Chat
</Link>

<Link to="/" onClick={logout} style={{ textDecoration: 'none' }}>
  Logout
</Link>
</div> */
}
