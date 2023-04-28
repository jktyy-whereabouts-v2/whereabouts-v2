import { User, Message, Nullable, Conversation } from "./types";
import * as React from "react";
import { ListItem, ListItemButton, ListItemText, CssBaseline } from "@mui/material";
import "@fontsource/roboto/300.css";


interface Props {
  contact: User;
}

export default function Conversations ({ contact }: Props){
  return (
    <ListItem>
      <CssBaseline />
      <ListItemButton dense>
        <ListItemText sx={{ marginRight: "150px" }} primary={`${contact.name}`}/>
      </ListItemButton>
    </ListItem>
  )
};


