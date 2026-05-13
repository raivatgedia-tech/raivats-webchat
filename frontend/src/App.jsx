import { useEffect, useState, useRef } from "react";

const colors = [
  "#ff6b6b",
  "#4ecdc4",
  "#ffe66d",
  "#1a535c",
  "#ff9f1c",
];

const getColor = (username) => {
  let hash = 0;

  for (let i = 0; i < username.length; i++) {
    hash += username.charCodeAt(i);
  }

  return colors[hash % colors.length];
};

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.10.84:3000");

    ws.onopen = () => {
      console.log("Connected to server");
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      setMessages((prev) => [...prev, parsedData]);
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    const messageData = {
      username,
      text: message,
    };

    socket.send(JSON.stringify(messageData));

    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h1>WebSocket Chat</h1>

      <input
        style={styles.input}
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <div>
              <strong
                style={{
                  color: getColor(msg.username),
                }}
              >
                {msg.username}
              </strong>

              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                {msg.timestamp}
              </span>
            </div>

            <div>{msg.text}</div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "50px auto",
    fontFamily: "Arial",
    color: "white",
  },

  chatBox: {
    border: "1px solid #444",
    height: "400px",
    overflowY: "scroll",
    padding: "10px",
    marginBottom: "10px",
    background: "#1e1e1e",
    borderRadius: "10px",
  },

  message: {
    background: "#2c2c2c",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  inputContainer: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    marginBottom: "10px",
  },

  button: {
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
  },
};

export default App;
