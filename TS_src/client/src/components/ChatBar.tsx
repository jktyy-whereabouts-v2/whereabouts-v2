import React from "react";

export default function ChatBar() {
  return (
    <div className="chat__sidebar">
      <h2>SOS Chat</h2>

      <div>
        <h4 className="chat__header">Active users:</h4>
        <div className="chat__users">
          <p>User 1</p>
          <p>User 2</p>
          <p>User 3</p>
          <p>User 4</p>
        </div>
      </div>
    </div>
  );
}
