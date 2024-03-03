import { useGlobalContext } from "../../context/appContext";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const { user, isAuthenticated, getChat, chat, setSocketInContext } =
    useGlobalContext();

  const socket = useMemo(() => {
    return io("http://localhost:5000/", {
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketInContext(socket);
      console.log("Connected to server");
    });
  }, []);

  const [receiverId, setReceiverId] = useState(
    window.location.pathname.split("/").pop().split("-")[0]
  );
  const [userId, setUserId] = useState(
    window.location.pathname.split("/").pop().split("-")[1]
  );
  const [roomId, setRoomId] = useState();
  // user.id + Number(receiverId) + user.id * Number(receiverId)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", { message, roomId, userId, receiverId });
      setMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(
        "receive-message",
        ({ message, userId, receiverId, roomId }) => {
          setMessages((prev) => [
            ...prev,
            { message, fromuser: userId, touser: receiverId, roomId: roomId },
          ]);
        }
      );
    }
  }, [socket]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("join-room", roomId);
    }
  }, [socket, roomId]);

  useEffect(() => {
    if (roomId) {
      try {
        getChat({ roomId });
      } catch (error) {
        console.log(error);
      }
    }
  }, [roomId]);

  useEffect(() => {
    if (userId && receiverId) {
      const calculatedRoomId =
        Number(userId) +
        Number(receiverId) +
        Number(userId) * Number(receiverId);
      if (!isNaN(calculatedRoomId) && calculatedRoomId !== undefined) {
        setRoomId(calculatedRoomId);
      }
    }
  }, [userId, receiverId]);

  useEffect(() => {
    setMessages(chat);
  }, [chat]);

  return (
    <>
      {!isAuthenticated && <Navigate to="/login" />}
      <div>
        <ul id="messages">
          {messages &&
            messages.map((message, index) => {
              if (message.fromuser == Number(userId)) {
                return (
                  <li key={index} style={{ color: "blueviolet" }}>
                    {message.message}
                  </li>
                );
              }
              return (
                <li key={index} style={{ color: "gray" }}>
                  {message.message}
                </li>
              );
            })}
        </ul>
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
