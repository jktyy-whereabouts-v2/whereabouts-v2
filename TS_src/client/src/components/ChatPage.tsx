import { User, UserProps } from './types';
import React, { useState, useEffect, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Box, styled, Typography, Stack, CssBaseline, InputBase } from '@mui/material';
import { Container } from '@mui/system';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import socket from '../main';

interface Props {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	path: string;
	socket: any;
	logout: Function;
}

interface Message {
	name: string;
	date_time: string;
	text: string;
}

export default function ChatPage({ userInfo, setUserInfo, path, socket, logout }: Props) {
	const [messages, setMessages] = useState<Message[]>([]); // have messages state here and NOT on ChatBody b/c socket was not passed down to ChatBody
	// to auto-scroll to latest chat message
	const lastMsgRef = useRef<HTMLElement>(null);

	useEffect(() => {
		// listens for connecting client
		socket.connect();
		// cleans up socket
		return () => {
			socket.disconnect();
		};
	}, []); // if no dependencies, only runs once (on component mount)

	// use useEffect to scroll to bottom of chat every time messages updates
	useEffect(() => {
		// listens for socket server's first msg event
		socket.on('autoMsg', (msg: string) => {
			// msg contains text only
			setMessages([
				...messages,
				{
					name: userInfo.name,
					date_time: new Date().toDateString() + ' ' + new Date().toLocaleTimeString('en-US'),
					text: msg,
				},
			]);
		});
		// listens for socket server's disperseMsg event
		socket.on('disperseMsg', (msgObj: Message) => {
			setMessages([...messages, msgObj]); // msgObj contains user's name, date_time, and typed text
		});
		// move scroll bar to bottom
		lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]); // on update of messages

	return (
		<>
			<Divider sx={{ width: '85%', margin: 'auto' }} variant="middle"></Divider>
			<CssBaseline />
			<Box sx={{ display: 'flex', mt: '30px' }}>
				<Container sx={{ width: '40%', ml: '30px' }}>
					<Sidebar logout={logout} />
				</Container>
				<Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px' }}>
					<ChatBody messages={messages} lastMsgRef={lastMsgRef} />
					<ChatFooter userInfo={userInfo} setUserInfo={setUserInfo} />
				</Container>
			</Box>
		</>
	);
}
