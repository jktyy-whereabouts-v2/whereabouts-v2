import { format } from 'timeago.js';
import { User, Message } from './types';
import "@fontsource/roboto/300.css";
import { Box, Card, Typography } from "@mui/material";

interface Props {
  userInfo: User;
  message: Message;
}


export default function Messages ({ userInfo, message }: Props){
  let boxStyle = {
    float: 'left',
    padding: '10px'
  };
  let styling = {
    backgroundColor: 'white',
    color: 'black',
    borderStyle: 'solid',
    borderColor: 'white',
    padding: '10px'
  };
  if(message.senderphone === userInfo.phone_number) {
    styling = {
      ...styling,
      backgroundColor: '#f6aa1c',
      color: 'white',
      borderStyle: 'none',
      borderColor: '#f6aa1c',
    }
    boxStyle = {
      ...boxStyle,
      float: 'right'
    }
  }
  return (
    <Box sx={boxStyle}>
      <Card sx={styling}>
        <Typography>{message.text}</Typography> 
      </Card>
      <Typography variant='caption'>{userInfo.phone_number !== message.senderphone ? message.sendername + ': ' : ''} {format(message.timestamp)}</Typography> 
    </Box>
  );
  };