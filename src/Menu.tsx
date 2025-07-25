// src/components/Menu.tsx
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Character } from "./types";
import "./Menu.css";

const initialCharacters: Character[] = [
  { id: 1, name: "Juan", image: "https://via.placeholder.com/100?text=Juan" },
  { id: 2, name: "María", image: "https://via.placeholder.com/100?text=María" },
  { id: 3, name: "Pedro", image: "https://via.placeholder.com/100?text=Pedro" },
];

interface MenuProps {
  onJoinRoom: (roomId: string) => void;
  playerId: string;
}

function Menu({ onJoinRoom, playerId }: MenuProps) {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const createRoom = async () => {
    const randomIndex = Math.floor(Math.random() * initialCharacters.length);
    const secretCharacter = initialCharacters[randomIndex];
    const roomData = {
      players: [playerId],
      secretCharacters: { [playerId]: secretCharacter }, // Personaje secreto del creador
      markedCharacters: [],
      createdAt: Date.now(),
    };
    const roomRef = await addDoc(collection(db, "rooms"), roomData);
    const roomId = roomRef.id;
    alert(`Sala creada con éxito. Código de sala: ${roomId}`);
    onJoinRoom(roomId);
  };

  const joinRoom = async () => {
    
    if (!roomCode) {
      setError("Ingresa un código de sala");
      return;
    }
    const roomRef = doc(db, "rooms", roomCode);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      const existingPlayers = roomData.players || [];
      if (!existingPlayers.includes(playerId)) {
        const usedCharacters = Object.values(roomData.secretCharacters || {}) as Character[];
        const availableCharacters = initialCharacters.filter(
          (char) => !usedCharacters.some((used) => used.id === char.id)
        );
        if (availableCharacters.length === 0) {
          setError("No hay más personajes disponibles");
          return;
        }
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        const secretCharacter = availableCharacters[randomIndex];
        await updateDoc(roomRef, {
          players: [...existingPlayers, playerId],
          [`secretCharacters.${playerId}`]: secretCharacter,
        });
      }
      onJoinRoom(roomCode);
    } else {
      setError("Sala no encontrada");
    }
  };

  return (
    <div className="menu">
      <h1>¿Quién es quién? - Online</h1>
      <div className="menu-options">
        <button onClick={createRoom}>Crear Sala</button>
        <div className="join-room">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Código de sala"
          />
          <button onClick={joinRoom}>Unirse a Sala</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Menu;