import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState([]);
  const [room, setRoom] = useState([]);
  const [roomId, setRoomId] = useState();
  const [messages, setMessages] = useState([]);
  const [groupName, setgroupName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server ", socket.id);
      setRoomId(socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("message", (msg) => {
      console.log(msg, "Message");
      setMessages((prev) => [...prev, msg]);
    })
  }, [socket]);

  const handleJoinGroup = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", { groupName });
    setgroupName("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    // setRoom("");
  }

  return (
    <Container>
      <br />
      <Typography variant="h6">Your Room Id : {roomId}</Typography>
      <br />

      <form onSubmit={handleJoinGroup}>
        <TextField id="message" label="Group Id" variant="outlined" fullWidth value={groupName}
          onChange={(e) => setgroupName(e.target.value)}
        />

        <Button variant="contained" color="primary" type="submit"> Join Group </Button>
      </form>
      <br />

      <form onSubmit={handleSubmit}>
        <TextField id="message" label="Message" variant="outlined" fullWidth value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <TextField id="room" label="Room" variant="outlined" fullWidth
          value={room} onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <Button variant="contained" color="primary" type="submit"> Send </Button>
      </form>

      <Stack spacing={2} style={{ marginTop: 20 }}>
        {
          messages.map((msg, index) => {
            return (
              <Typography key={index} >
                {msg}
              </Typography>
            )
          })
        }
      </Stack>
    </Container>
  )
}

export default App