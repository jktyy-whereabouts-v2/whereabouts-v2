import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Paper } from '@mui/material';
import { User, UserProps } from '../types';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import GoogleButton from 'react-google-button';

const LOGIN_URL = '/api/login';

interface LoginProps {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	login: Function;
}

function Login({ userInfo, setUserInfo, login }: LoginProps) {
	const [userData, setUserData] = useState({
		phone_number: '',
		password: '',
	});

	const navigate = useNavigate();
	// hook to redirect after successful login
	const [redirect, setRedirect] = useState<boolean>(false);
	const [redirectToGoogle, setRedirectToGoogle] = useState(false);

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		// const userLogin = {
		// 	phone_number: userInfo.phone_number,
		// 	password: userInfo.password,
		// };

		try {
			const response = await axios.post(LOGIN_URL, userData);
			if (response.data) {
				login(response.data);
				setRedirect(true);
			}
		} catch (error) {
			toast.error('Incorrect Login');
		}
	};

	useEffect(() => {
		// setUserInfo(JSON.parse(localStorage.getItem('user') || ''));
		if (userInfo.name.length > 0) {
			navigate('/contacts');
		}
	}, []);

	// once user is logged in, they can no longer go back to the login page
	useEffect(() => {
		if (redirect) {
			navigate('/contacts');
		}
	});

	const paperStyle = { padding: 40, width: 375, margin: 'auto' };

	return (
		<>
			<Container maxWidth="xs">
				<CssBaseline />
				<Paper elevation={2} style={paperStyle}>
					<Box
						sx={{
							marginTop: 8,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography sx={{ mb: 3 }} variant="h5">
							Login
						</Typography>
						<Link to="http://localhost:3500/auth/google/oauth" style={{ textDecoration: 'none' }}>
							<GoogleButton />
						</Link>
						<Typography sx={{ mt: 3 }}>- or -</Typography>
						<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="Phone Number"
								name="phone_number"
								onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
								value={userData.phone_number}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								onChange={(e) => setUserData({ ...userData, password: e.target.value })}
								value={userData.password}
							/>
							<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
								Sign In
							</Button>
							<Grid container>
								<Grid item>
									<Link to="/register">{"Don't have an account? Sign Up"}</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Paper>
			</Container>
		</>
	);
}

export default Login;
