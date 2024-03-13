import { useGlobalContext } from "../../context/appContext";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function Chat() {
  const { isAuthenticated, getChat, chat, setSocketInContext } =
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
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "grey.200",
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {messages &&
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  receiverId={receiverId}
                />
              ))}
          </Box>
          <Box sx={{ p: 2, backgroundColor: "background.default" }}>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Type a message"
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </>
  );
}

const Message = ({ message, receiverId }) => {
  const isReceiver = message.fromuser === Number(receiverId);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isReceiver ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isReceiver ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ bgcolor: isReceiver ? "primary.main" : "secondary.main" }}
        >
          {isReceiver ? "R" : "U"}
        </Avatar>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isReceiver ? 1 : 0,
            mr: isReceiver ? 0 : 1,
            backgroundColor: isReceiver ? "primary.light" : "secondary.light",
            borderRadius: isReceiver
              ? "20px 20px 20px 5px"
              : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.message}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Chat;
