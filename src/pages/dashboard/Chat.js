import React, { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "../../context/appContext";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const socket = useMemo(() => {
    return io("http://localhost:5000/", {
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, []);

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  const { isAuthenticated } = useGlobalContext();
  return (
    <>
      {!isAuthenticated && <Navigate to="/login" />}
      <div>
        <ul id="messages"></ul>
        <form id="form" onSubmit={handleSubmit}>
          <input
            id="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default Chat;
