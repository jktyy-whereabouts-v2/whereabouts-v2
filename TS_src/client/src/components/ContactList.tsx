import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox,
  CssBaseline,
  Container,
  Box,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import "@fontsource/roboto/300.css";
import { User } from "./types";

interface Props {
  contacts: any;
  deleteContact: (index: number, contact: User) => void;
  checkedContacts: User[];
  setCheckedContacts: React.Dispatch<React.SetStateAction<Array<User>>>;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ContactsList({
  contacts,
  deleteContact,
  checkedContacts,
  setCheckedContacts,
  setButtonDisabled,
}: Props) {
  // adding contacts to the user's checked contact list
  const handleToggle = (contact: User) => () => {
    const currentIndex = checkedContacts.indexOf(contact);
    const newChecked: User[] = [...checkedContacts];
    // add to the checked contact list, if not already in the list
    if (currentIndex === -1) {
      newChecked.push(contact);
    }
    // if contact is already in the list, remove it
    else {
      newChecked.splice(currentIndex, 1);
    }
    // if user's checked contact list is now empty, disable the starting trip button
    if(newChecked.length === 0) setButtonDisabled(true);
    else setButtonDisabled(false);
    setCheckedContacts(newChecked);
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <List>
          <CssBaseline />
          {Array.isArray(contacts) &&
            contacts.map((value: User, index: number)  => {
              const labelId = `checkbox-list-label-${value}`;
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => deleteContact(index, value)}
                    >
                      <Delete />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton onClick={handleToggle(value)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checkedContacts.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ marginRight: "150px" }}
                      id={labelId}
                      primary={`${value.name}`}
                      secondary={`${value.phone_number}`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </Box>
    </>
  );
};
