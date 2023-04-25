import { User } from "./types";
import React, { useState, useEffect } from "react";
import { CssBaseline, Container, Box, Typography, TextField, IconButton, Card, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import SendIcon from '@mui/icons-material/Send';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');


interface Props {
  userInfo: User;
  contacts: Array<User>;
  logout: Function;
}

interface Message {
  name: string;
  phone_number: string;
  date_time: string;
  text: string;
}

export default function ChatPage ({ userInfo, contacts, logout } : Props){
  socket.emit('join', {phone_number: userInfo.phone_number});
  const [conversation, setConversation] = useState<Array<Message>>([]);
  const [message, setMessage] = useState<Message>({
    name: '',
    phone_number: '',
    date_time: '',
    text: ''
  });
  // const socket: any = useSocket();

  const sendMessage = (event: any) => {
    event.preventDefault();
		const messageInput = event.target[0].value;
    const today = new Date();
    if (messageInput !== '') {
      setMessage({
      name: userInfo.name,
      phone_number: userInfo.phone_number,
      date_time: today.getHours() + ':' + today.getMinutes(),
      text: messageInput
      });
    }
    event.target[0].value = '';
    socket.emit('send_message', {contacts, message});
  };

  useEffect(() => {
    if(message.text !== '') setConversation([...conversation, message]);
  }, [message]);

  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      setConversation([...conversation, msg]);
    })
  }, [conversation]);

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
          <Box sx={{ borderStyle: 'solid', borderColor: '#DCDCDC', borderRadius: '5%', width: '50%', height: '50vh', display: 'flex', overflowY: 'scroll', flexDirection: 'column', margin: '3px' }}>
            <Typography sx= {{width: '100%'}} variant='caption' align='center'>{new Date().toDateString()}</Typography>
            {
              conversation.length ? conversation.map((message, index) => {
                let styling = {
                  backgroundColor: 'white',
                  color: 'black',
                  borderStyle: 'solid',
                  borderColor: '#DCDCDC',
                  float: 'left',
                  margin: '5px',
                  padding: '10px'
                };
                if(message.phone_number === userInfo.phone_number) {
                  styling = {
                    ...styling,
                    backgroundColor: '#4dabf5',
                    color: 'white',
                    borderStyle: 'none',
                    borderColor: 'blue',
                    float: 'right',
                  }
                }
                return (
                  <Box>
                    <Card key={index} sx={styling}>
                      <Typography align='right'>{message.text}</Typography>
                      <Typography variant='caption'>{message.name} : {message.date_time}</Typography>
                    </Card>
                  </Box>                
                );
              }) : null
            }
          </Box>
          <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<TextField sx={{ width: '50%' }} placeholder='Message...' id='MessageField' name='sendMessage' />
						<IconButton type='submit' color='primary'>
							<SendIcon />
						</IconButton>
					</Box>
        </Container>
      </Box>
    </>
  );
}
