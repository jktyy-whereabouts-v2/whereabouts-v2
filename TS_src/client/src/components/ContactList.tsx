import * as React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Checkbox,
  CssBaseline,
  Container
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import '@fontsource/roboto/300.css';
import { User } from './types';

interface Props {
  contacts: User[],
  deleteContact: (index: number, contact: User) => void,
  checkedContacts: User[],
  setCheckedContacts: React.Dispatch<React.SetStateAction<User[]>>,
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
};


export default function ContactsList({
  contacts,
  deleteContact,
  checkedContacts,
  setCheckedContacts,
  setButtonDisabled
}: Props) {

  const handleToggle = (contact: User) => () => {
    const currentIndex = checkedContacts.indexOf(contact);
    const newChecked: User[] = [...checkedContacts];
    if (currentIndex === -1) {
      newChecked.push(contact);
    }
    else {
      newChecked.splice(currentIndex, 1);
    }
    // set new checked items in array from Contacts
    // const newCheckedContacts : User[] = [...checkedContacts];
    // newCheckedContacts[index] = contact;
    if(newChecked.length === 0) setButtonDisabled(true);
    else setButtonDisabled(false);
    setCheckedContacts(newChecked);
  };
  return (
    <Container maxWidth='sm'>
      <List >
        <CssBaseline />
        {contacts.length !== 0 && contacts.map((value, index) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem 
            key={index}
            secondaryAction={
              <IconButton
                edge='end'
                onClick={() => deleteContact(index, value)}
              >
                <Delete />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              onClick={handleToggle(value)}
              dense
            >
            <ListItemIcon>
              <Checkbox
                edge='start'
                checked={checkedContacts.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={`${value.name}`}
              secondary= {`${value.phone_number}`}
            />
          </ListItemButton>
        </ListItem>)
      })}
      </List>
    </Container>
  );
}
