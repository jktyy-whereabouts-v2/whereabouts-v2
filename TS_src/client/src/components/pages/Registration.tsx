import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, styled, Typography, Avatar, Button, CssBaseline, TextField, Grid, Paper } from '@mui/material';
import { Container } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { User, UserProps } from '../types';
import { toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import GoogleButton from 'react-google-button';

const REGISTER_URL = '/api/register';

interface RegistrationProps {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	login: Function;
}

function Registration({ userInfo, setUserInfo, login }: RegistrationProps) {
	const navigate = useNavigate();

	interface StatusProps {
		sent: boolean;
		message: string;
	}

	const [passMatch, setPassMatch] = useState<boolean>(true);
	const [subStatus, setSubStatus] = useState<StatusProps>({
		sent: false,
		message: '',
	});

	// conditional alert
	const mismatchAlert = passMatch ? '' : 'Passwords do not match.';
	//const subFailedAlert = subStatus ? '' : 'Submission failed. Please try again.';
	const subFailedAlert = !subStatus.sent ? '' : subStatus.message;

	// hook to redirect after successful registration
	const [redirect, setRedirect] = useState(false);
	const [redirectToGoogle, setRedirectToGoogle] = useState(false);

	// confirms first password entry & second password entry match
	const confirmMatch = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === userInfo.password) {
			setPassMatch(true);
		} else {
			setPassMatch(false);
		}
	};
	/*
      Sends user data to backend, redirects to contacts page if successful.
      If not, alerts user of failure.
    */
	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		// console.log("submitting user data");
		if (!passMatch) {
			setSubStatus((prevState) => {
				return {
					...prevState,
					status: false,
					message: 'Passwords do not match. Please correct before submitting',
				};
			});
			toast.error('Passwords do not match. Please try again.');

			return;
		}
		try {
			const response = await axios.post(REGISTER_URL, userInfo);
			if (response.data) {
				login(response.data);
				setRedirect(true);
			}
		} catch (err: any) {
			// render user alert that submission failed
			console.log('this is the error =>', err.response.data.error);
			setSubStatus((prevState) => {
				return {
					...prevState,
					sent: true,
					message: err.response.data.error,
				};
			});
		}
	};

	useEffect(() => {
		// setUserInfo(JSON.parse(localStorage.getItem('user') || ''));
		if (userInfo.name.length > 0) {
			navigate('/dashboard');
		}
	}, []);

	useEffect(() => {
		if (redirect) {
			navigate('/dashboard');
		}
	});

	// useEffect(() => {
	// 	// setUserInfo(JSON.parse(localStorage.getItem('user') || ''));
	// 	if (userInfo) {
	// 		navigate('/dashboard');
	// 	}
	// }, []);

	useEffect(() => {
		if (redirectToGoogle) {
			setTimeout(() => {
				window.close();
			}, 1000);
			navigate('/dashboard');
		}
	}, []);

	const paperStyle = { padding: 20, width: 375, margin: 'auto' };

	const redirectToGoogleSSO = async () => {
		const googleLoginURL = 'http://localhost:3500/api/auth/google/callback';
		const newWindow = window.open(googleLoginURL, '_blank', 'width = 500, height = 600');
		setRedirectToGoogle(true);
		fetchAuthUser();
	};

	const fetchAuthUser = async () => {
		try {
			const response = await axios.get('http://localhost:3500/api/auth/google/callback');
			if (response.data) {
				console.log(response.data);
			}
		} catch (error) {
			toast.error('Sorry, not authenticated.');
		}
	};

	return (
		<Container maxWidth="xs">
			<CssBaseline />
			<Paper elevation={2} style={paperStyle}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Avatar sx={{ m: 1, bgcolor: 'info.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography sx={{ mb: 3 }} variant="h5">
						Sign up
					</Typography>
					<GoogleButton onClick={redirectToGoogleSSO} />
					<Typography sx={{ mt: 3 }}>- or -</Typography>
					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
						<Grid container>
							<Grid item xs={12}>
								<TextField margin="normal" required fullWidth id="name" name="name" label="Full Name" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
							</Grid>
							<Grid item xs={12}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="email"
									label="Phone Number"
									name="phone_number"
									onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
									value={userInfo.phone_number}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
									value={userInfo.password}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField margin="normal" required fullWidth name="password" label="Confirm Password" type="password" id="confirm-password" onChange={confirmMatch} />
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Typography sx={{ color: 'red' }}>{mismatchAlert}</Typography>
						</Grid>
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
							Sign Up
						</Button>
						<Grid container sx={{ justifyContent: 'flex-end' }}>
							<Grid item>
								<Link to="/login">Already have an account? Log in</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}

export default Registration;

{
	/* <div className="registration-container">
			<br></br>
			{redirect && <Navigate to="/dashboard" replace={true} />}
			<form className="registration-form" onSubmit={handleSubmit}>
				<div className="registration-input-container">
					<br></br>
					<h3>Sign Up</h3>
					<br></br>
					<TextField label="full name" type="text" className="input-box" name="name" id="name" size="small" helperText="enter your first and last name" required={true} onChange={onChange} />
				</div>
				<br></br>
				<div className="registration-input-container">
					<TextField label="phone number" type="text" className="input-box" name="phone_number" id="phone" size="small" required={true} onChange={onChange} />
				</div>
				<br></br>
				<div className="registration-input-container">
					<TextField label="password" type="password" className="input-box" name="password" id="password" size="small" required={true} onChange={onChange} />
				</div>
				<br></br>
				<div className="registration-input-container">
					<TextField label="confirm password" type="password" className="input-box" name="password" id="confirm-password" size="small" required={true} onChange={confirmMatch} />
					<p>{mismatchAlert}</p>
				</div>
				<br></br>
				<Button type="submit" className="styleMe" variant="contained">
					Create Your Account
				</Button>
				<br></br>
				<Button type="submit" className="styleMe" variant="text">
					Already Have an Account? Sign In
				</Button>
				<br></br>
			</form>
			<br></br>
			<p>{subStatus.message}</p>
		</div> */
}
