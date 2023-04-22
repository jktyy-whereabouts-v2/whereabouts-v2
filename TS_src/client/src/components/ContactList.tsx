import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { User } from "./types";

interface Props {
  contacts: User[],
  deleteContact: (index: number) => void,
  checkedContacts: User[],
  setCheckedContacts: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function ContactsList({
  contacts,
  deleteContact,
  checkedContacts,
  setCheckedContacts,
}: Props) {
  const [checked, setChecked] = React.useState<User[]>([]);

  const handleToggle = (contact: User, index: number) => () => {
    const currentIndex = checked.indexOf(contact);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(contact);
    }
    // } else {
    //   newChecked.splice(currentIndex, 1);
    // }
    setChecked(newChecked);

    // set new checked items in array from Contacts
    const newCheckedContacts : User[] = [...checkedContacts];
    newCheckedContacts[index] = contact;
    setCheckedContacts(newCheckedContacts);
  };

  return (
    <List sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}>
      {[...contacts].map((value, index) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={() => deleteContact(index)}
              >
                <DeleteForeverRoundedIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value, index)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`Contact Name: ${contacts[index].name},     Phone Number: ${contacts[index].phone_number}`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
