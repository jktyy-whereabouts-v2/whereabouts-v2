import { User, Nullable, Conversation } from "./types";
import { ListItem, ListItemButton, ListItemText, CssBaseline } from "@mui/material";
import "@fontsource/roboto/300.css";
import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';


interface Props {
  userInfo: User;
  contactName: string;
  contactPhone: string;
  setCurrentConv: Dispatch<SetStateAction<Nullable<Conversation>>>;
  setReceiverName: Dispatch<SetStateAction<string>>;
  setReceiverPhone: Dispatch<SetStateAction<string>>;
}

export default function Conversations ({ userInfo, contactName, contactPhone, setCurrentConv, setReceiverName, setReceiverPhone }: Props){

  // when a conversation/contact is clicked, the selected conversation is displayed
  const handleClick = async (event: any) => {
    const response = await axios.get(`/api/chat/convContact/user/${userInfo.phone_number}/contact/${contactPhone}`);
    setCurrentConv(response.data);
    setReceiverName(contactName);
    setReceiverPhone(contactPhone);
  };

  return (
  <ListItem>
    <CssBaseline />
    <ListItemButton onClick={handleClick} dense>
      <ListItemText sx={{ marginRight: "150px" }} primary={`${contactName}`}/>
    </ListItemButton>
  </ListItem>
  )
};


