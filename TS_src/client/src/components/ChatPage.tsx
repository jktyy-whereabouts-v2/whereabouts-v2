import { User, Message, Nullable, Conversation } from "./types";
import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import { CssBaseline, Container, Box, TextField, IconButton, List, InputAdornment } from '@mui/material';
import '@fontsource/roboto/300.css';
import SendIcon from '@mui/icons-material/Send';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import { io } from 'socket.io-client';
import Conversations from './Conversations';
import axios from 'axios';
import Messages from './Messages';



interface Props {
  userInfo: User;
  contacts: Array<User>;
  logout: Function;
  setContacts: Dispatch<SetStateAction<any>>;
}

export default function ChatPage ({ userInfo, contacts, setContacts, logout } : Props){
  const [currentConv, setCurrentConv]  = useState<Nullable<Conversation>>(null);
  const [receivername, setReceiverName] = useState<string>('');
  const [receiverphone, setReceiverPhone] = useState<string>('');
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState<Nullable<Message>>(null);
  const [otherConv, setOtherConv] = useState<Array<Conversation>>([]);
  const socket: any = useRef();
  const scrollRef: any = useRef();
  
  // socket.io, receiving messages from another user
  useEffect(() => {
    socket.current= io('http://localhost:3001');
    socket.current.on('getMessage', (data: Message) => {
      setNewMessage({
        sendername: data.sendername,
        senderphone: data.senderphone,
        text: data.text,
        receivername: data.receivername,
        receiverphone: data.receiverphone,
        convid: data.convid,
        timestamp: data.timestamp
      })
    });
  });

  // adding user to an array of active users in server.ts
  useEffect(() => {
    socket.current.emit('addUser', userInfo.phone_number);
  }, [userInfo]);


  // getting contacts of user to display
  useEffect(() => {
    if(userInfo?.phone_number) axios.get(`/api/contacts/${userInfo.phone_number}`)
    .then(response => {
      setContacts(response.data);
    })
    .catch(err => console.log(err.message));
  }, [userInfo]);

  // if a new message for the current conversation has been received, add it to the message array
  useEffect(() => {
    newMessage && (currentConv?.member1phone === userInfo.phone_number || currentConv?.member2phone === userInfo.phone_number) && setMessages(prev => [...prev, newMessage]);
  }, [newMessage, currentConv]);

  // to scroll to the last message received
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // retrieves conversations with users that are not part of your contact
  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get(`/api/chat/conversations/${userInfo.phone_number}`);
        const conversations = [];
        for(const conv of response.data) {
          let count = 0;
          for(const contact of contacts) {
            if(conv.member1phone === contact.phone_number || conv.member2phone === contact.phone_number) count++;
          }
          if(count === 0) conversations.push(conv);
        }
        setOtherConv(conversations);
      } catch(error) {
        console.log('getConversations: ', error);
      }
    };
    getConversations();
  }, [userInfo, contacts]);

  // retrieves past messages for the current conversation
  useEffect(() => {
    const getMessages = async () => {
      try {
        if(currentConv) {
          const response = await axios.get(`api/chat/messages/${currentConv.convid}`);
          setMessages(response.data);
        }
      } catch (error: any) {
        console.log('getMessages error:', error);
      }
    };
    getMessages();
  }, [currentConv]);

  // handles a new messages submitted by the user.
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const inputMessage = event.target[0].value;
    const message = {
      sendername: userInfo.name,
      senderphone: userInfo.phone_number,
      text: inputMessage,
      receivername,
      receiverphone,
      convid: currentConv?.convid,
      timestamp: Date.now()
    };
    event.target[0].value = '';
    // add message to messages array
    setMessages(prev => [...prev, message]);
    // send message to recipient
    socket.current.emit('sendMessage', message);
    try {
      // add message to the database
      await axios.post('api/chat/messages', message);
    } catch (error) {
      console.log('handleSubmit: ', error);
    }
  };
  return (
    <>
    <Divider sx={{ width: '85%', margin: 'auto' }} variant='middle' />
    <CssBaseline />
    <Box sx={{ display: 'flex', mt: '30px' }}>
      <Container sx={{ width: '40%', ml: '30px' }}>
        <Sidebar logout={logout} />    
      </Container>
      <Container sx={{ width: '20%', ml: '30px' }}>
        <List>
          {
          contacts?.map((contact: User, index: number) => (
          <Conversations key={'conv'+index} userInfo={userInfo} contactName={contact.name} contactPhone={contact.phone_number} setCurrentConv={setCurrentConv} setReceiverName={setReceiverName} setReceiverPhone={setReceiverPhone} />
          ))
          }
          {
          otherConv?.map((conv, index: number) => {
            const contactName = conv.member1phone === userInfo.phone_number? conv.member2name : conv.member1name;
            const contactPhone = conv.member1phone === userInfo.phone_number? conv.member2phone : conv.member1phone;
            return <Conversations key={'convs'+index} userInfo={userInfo} contactName={contactName} contactPhone={contactPhone} setCurrentConv={setCurrentConv} setReceiverName={setReceiverName} setReceiverPhone={setReceiverPhone}/> 
          })
          }
          </List>
      </Container>
      <Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px', marginTop: '20px' }}>
        {
        currentConv && <Box>
          <Box sx={{ borderStyle: 'solid', borderColor: '#DCDCDC', width: '50%', height: '50vh', display: 'flex', overflowY: 'scroll', flexDirection: 'column', margin: '3px' }}>
            {
            messages?.map((message: Message, index: number) => (
            <div ref={scrollRef}><Messages key={'msg'+index} userInfo={userInfo} message={message}/></div>
            ))
            }
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <TextField sx={{ width: '50%' }}  placeholder='Message...' id='MessageField' name='sendMessage' InputProps={{
              endAdornment: (
              <InputAdornment position='end'>
                <IconButton type='submit' edge='end'>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
              ),
            }}/>
          </Box>
        </Box>
        }
      </Container>  
    </Box>

    </>
  );
}
