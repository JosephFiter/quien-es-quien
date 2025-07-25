// src/components/Chat.tsx
import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Message } from "./types";
import "./Chat.css";

interface ChatProps {
  roomId: string;
  playerId: string;
  gameState: "playing" | "finished";
}

function Chat({ roomId, playerId, gameState }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [roomId]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || gameState !== "playing") return;
    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    await addDoc(messagesRef, {
      text: newMessage.trim(),
      timestamp: Date.now(),
      playerId,
    });
    setNewMessage("");
  };

  return (
    <div className="chat">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.playerId === playerId ? "my-message" : "opponent-message"}`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={gameState !== "playing"}
        />
        <button type="submit" disabled={!newMessage.trim() || gameState !== "playing"}>
          Enviar
        </button>
      </form>
      {gameState === "finished" && <p className="chat-disabled">La partida ha terminado</p>}
    </div>
  );
}

export default Chat;