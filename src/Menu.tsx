// src/components/Menu.tsx
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Character } from "./types";
import "./Menu.css";

const initialCharacters: Character[] = [
  { id: 1, name: "Vito", image: "https://via.placeholder.com/100?text=Vito" },
  { id: 2, name: "Fefo", image: "https://via.placeholder.com/100?text=Fefo" },
  { id: 3, name: "Pava", image: "https://via.placeholder.com/100?text=Pava" },
  { id: 4, name: "Mauri", image: "https://via.placeholder.com/100?text=Mauri" },
  { id: 5, name: "Suaya", image: "https://via.placeholder.com/100?text=Suaya" },
  { id: 6, name: "Mati", image: "https://via.placeholder.com/100?text=Mati" },
  { id: 7, name: "Juan", image: "https://via.placeholder.com/100?text=Juan" },
  { id: 8, name: "Najenson", image: "https://via.placeholder.com/100?text=Najenson" },
  { id: 9, name: "Adar", image: "https://via.placeholder.com/100?text=Adar" },
  { id: 10, name: "Ronel", image: "https://via.placeholder.com/100?text=Ronel" },
  { id: 11, name: "Leo", image: "https://via.placeholder.com/100?text=Leo" },
  { id: 12, name: "Felix", image: "https://via.placeholder.com/100?text=Felix" },
  { id: 13, name: "Oliber", image: "https://via.placeholder.com/100?text=Oliber" },
  { id: 14, name: "Chapu", image: "https://via.placeholder.com/100?text=Chapu" },
  { id: 15, name: "Burstein", image: "https://via.placeholder.com/100?text=Burstein" },
  { id: 16, name: "Setton", image: "https://via.placeholder.com/100?text=Setton" },
  { id: 17, name: "Uri", image: "https://via.placeholder.com/100?text=Uri" },
  { id: 18, name: "Saban", image: "https://via.placeholder.com/100?text=Saban" },
  { id: 19, name: "Pinky", image: "https://via.placeholder.com/100?text=Pinky" },
  { id: 20, name: "Bistec", image: "https://via.placeholder.com/100?text=Bistec" },
  { id: 21, name: "Lola Cadoche", image: "https://via.placeholder.com/100?text=Lola%20Cadoche" },
  { id: 22, name: "Lola Kiperszmid", image: "https://via.placeholder.com/100?text=Lola%20Kiperszmid" },
  { id: 23, name: "Porky", image: "https://via.placeholder.com/100?text=Porky" },
  { id: 24, name: "Emma Turek", image: "https://via.placeholder.com/100?text=Emma%20Turek" },
  { id: 25, name: "Laura Kaleka", image: "https://via.placeholder.com/100?text=Laura%20Kaleka" },
  { id: 26, name: "Liel", image: "https://via.placeholder.com/100?text=Liel" },
  { id: 27, name: "Ana", image: "https://via.placeholder.com/100?text=Ana" },
  { id: 28, name: "Dominic", image: "https://via.placeholder.com/100?text=Dominic" },
  { id: 29, name: "Mica la Tana", image: "https://via.placeholder.com/100?text=Mica%20la%20Tana" },
  { id: 30, name: "Mica Son", image: "https://via.placeholder.com/100?text=Mica%20Son" },
  { id: 31, name: "Aby", image: "https://via.placeholder.com/100?text=Aby" },
  { id: 32, name: "Castre", image: "https://via.placeholder.com/100?text=Castre" },
  { id: 33, name: "Ian Stupnik", image: "https://via.placeholder.com/100?text=Ian%20Stupnik" },
  { id: 34, name: "Ian Dorfman", image: "https://via.placeholder.com/100?text=Ian%20Dorfman" },
  { id: 35, name: "Naguito", image: "https://via.placeholder.com/100?text=Naguito" },
  { id: 36, name: "More", image: "https://via.placeholder.com/100?text=More" },
  { id: 37, name: "Cata", image: "https://via.placeholder.com/100?text=Cata" },
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
      secretCharacters: { [playerId]: secretCharacter },
      markedCharactersByPlayer: { [playerId]: [] }, // Inicializamos marcados para el creador
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
          [`markedCharactersByPlayer.${playerId}`]: [], // Inicializamos marcados para el nuevo jugador
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