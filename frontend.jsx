// Core chat interface with WebSocket
const socket = io('http://localhost:3001');

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);
  
  // Message handling logic
  // ...
}