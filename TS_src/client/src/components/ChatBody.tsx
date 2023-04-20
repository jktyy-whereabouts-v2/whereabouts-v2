import { colors } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  name: string;
  date_time: string;
  text: string;
}

interface Props {
  messages: Message[];
  lastMsgRef: any;
}

export default function ChatBody({ messages, lastMsgRef }: Props) {
  const navigate = useNavigate();

  const handleExitChat = () => {
    // triggered when a user in chat clicks Exit Chat button
    navigate("/dashboard"); // back to user's trips page?
    window.location.reload();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <h2 style={{ color: "#ef8e48" }}>SOS Chat</h2>
        <button className="leaveChat__btn" onClick={handleExitChat}>
          End Chat / Trip
        </button>
      </header>

      <div className="message__container">
        {messages.map((msg, i) => (
          <div className="message__chats" key={i}>
            <p
              style={{
                color: "#00a676",
                fontStyle: "italic",
                fontSize: "10px",
              }}
            >
              {msg.date_time} - {msg.name} sent:
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={lastMsgRef} />
        {/*Shown when a user is typing*/}
        <div className="message__status">{/* <p>Typing...</p> */}</div>
      </div>
    </>
  );
}
