import { User, Message, Nullable, Conversation } from "./types";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { CssBaseline, Container, Box, Typography, TextField, IconButton, Card, createTheme, List, InputAdornment } from '@mui/material';
import '@fontsource/roboto/300.css';
import SendIcon from '@mui/icons-material/Send';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import io from 'socket.io-client';
import Conversations from './Conversations';
import axios from 'axios';

const socket = io('http://localhost:3001');


interface Props {
  userInfo: User;
  contacts: Array<User>;
  logout: Function;
  setContacts: Dispatch<SetStateAction<any>>;
}

export default function ChatPage ({ userInfo, contacts, setContacts, logout } : Props){
  const [currentConv, setCurrentConv]  = useState<Nullable<Conversation>>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
		axios.get(`/api/contacts/${userInfo.phone_number}`)
		.then(response => {
			setContacts(response.data);
		})
		.catch(err => console.log(err.message));
	}, [userInfo]);

  return (
  <>
  <Divider sx={{ width: '85%', margin: 'auto' }} variant='middle'></Divider>
  <CssBaseline />
  <Box sx={{ display: 'flex', mt: '30px' }}>
    <Container sx={{ width: '40%', ml: '30px' }}>
      <Sidebar logout={logout} />
    </Container>
    <Container sx={{ width: '40%', ml: '30px' }}>
      <List>
        {
        contacts.length > 0 && contacts.map((contact: User) => (
        <Conversations contact={contact}/>
        ))
        }
      </List>
    </Container>  
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px', marginTop: '20px' }}>
      <Box sx={{ borderStyle: 'solid', borderColor: '#DCDCDC', borderRadius: '5%', width: '50%', height: '50vh', display: 'flex', overflowY: 'scroll', flexDirection: 'column', margin: '3px' }}>
      </Box>
      <Box component='form' sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <TextField sx={{ width: '50%' }} placeholder='Message...' id='MessageField' name='sendMessage' InputProps={{
          endAdornment: (
          <InputAdornment position='end'>
            <IconButton type='submit' edge='end' color='primary'>
              <SendIcon />
            </IconButton>
          </InputAdornment>
          ),
        }}/>
      </Box>
    </Container>
  </Box>
  </>
  );
};
