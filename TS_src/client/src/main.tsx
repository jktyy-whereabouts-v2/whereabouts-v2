import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { render } from "react-dom";
import { io } from "socket.io-client";

// initialize socket on client side
// creates a new Manager for the given host URL (https://socket.io/docs/v4/client-api/#manager)
const socket = io("http://localhost:3000/", {
  autoConnect: false,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default socket;
