import { User, UserProps } from "./types";
import React, { useState, useEffect, useRef } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
// import socket from "../main";

interface Props {
  userInfo: User;
  setUserInfo: React.Dispatch<React.SetStateAction<User>>;
  path: string;
  socket: any;
}

interface Message {
  name: string;
  date_time: string;
  text: string;
}

export default function ChatPage({
  userInfo,
  setUserInfo,
  path,
  socket,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]); // have messages state here and NOT on ChatBody b/c socket was not passed down to ChatBody
  // to auto-scroll to latest chat message
  const lastMsgRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // listens for connecting client
    socket.connect();
    // cleans up socket
    return () => {
      socket.disconnect();
    };
  }, []); // if no dependencies, only runs once (on component mount)

  // use useEffect to scroll to bottom of chat every time messages updates
  useEffect(() => {
    // listens for socket server's first msg event
    socket.on("autoMsg", (msg: string) => {
      // msg contains text only
      setMessages([
        ...messages,
        {
          name: userInfo.name,
          date_time:
            new Date().toDateString() +
            " " +
            new Date().toLocaleTimeString("en-US"),
          text: msg,
        },
      ]);
    });
    // listens for socket server's disperseMsg event
    socket.on("disperseMsg", (msgObj: Message) => {
      setMessages([...messages, msgObj]); // msgObj contains user's name, date_time, and typed text
    });
    // move scroll bar to bottom
    lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // on update of messages

  return (
    <div className="chat">
      {/* <ChatBar /> */}
      <div className="chat__main">
        <ChatBody messages={messages} lastMsgRef={lastMsgRef} />
        {/* passing down messages to ChatBody to display */}
        <ChatFooter userInfo={userInfo} setUserInfo={setUserInfo} />
      </div>
    </div>
  );
}
