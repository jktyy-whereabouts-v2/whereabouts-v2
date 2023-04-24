import { User, UserProps } from "./types";
import React, { useState, useEffect, useRef } from "react";
import { CssBaseline, Container, Box, Typography, TextField, IconButton, Button } from '@mui/material';
import { TextareaAutosize } from '@mui/base';
import '@fontsource/roboto/300.css';
import SendIcon from '@mui/icons-material/Send';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import socket from "../main";


interface Props {
  userInfo: User;
  contacts: Array<User>;
  socket: any;
  logout: Function;
}

interface Message {
  name: string;
  date_time: string;
  text: string;
}

export default function ChatPage ({ userInfo, contacts, socket, logout } : Props){
  const [conversation, setConversation] = useState<Array<Message>>([]);
  const [message, setMessage] = useState<Message>({
    name: userInfo.name,
    date_time: '',
    text: ''
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
		const messageInput = event.target[0].value;
		event.target[0].value = '';
    setMessage({
      ...message,
      date_time: new Date().toDateString(),
      text: messageInput
    });

    setConversation([...conversation, message]);

  };

  return (
    <>
      <Divider sx={{ width: '85%', margin: 'auto' }} variant="middle"></Divider>
      <CssBaseline />
      <Box sx={{ display: 'flex', mt: '30px' }}>
        <Container sx={{ width: '40%', ml: '30px' }}>
					<Sidebar logout={logout} />
				</Container> 
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px', marginTop: '20px' }}>
          <Typography variant='h6'>ChatRoom</Typography>
          <Box sx={{ borderStyle: 'solid', borderColor: '#DCDCDC', borderRadius: '5%', width: '50%', height: '50vh' }}>
            Chat messages
            
          </Box>
          <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<TextField rows='2' multiline sx={{ width: '50%' }} placeholder='Message...' id='MessageField' name='sendMessage' />
						<IconButton type='submit' color='primary'>
							<SendIcon />
						</IconButton>
					</Box>
        </Container>
      </Box>
    </>
  );
}
