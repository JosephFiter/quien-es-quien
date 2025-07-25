// src/App.tsx
import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Importamos uuid
import { Character } from "./types";
import GameBoard from "./GameBoard";
import Chat from "./Chat";
import GuessWinner from "./GuessWinner";
import Menu from "./Menu";
import "./App.css";

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId] = useState<string>(uuidv4()); // Generamos un ID único para el jugador

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
  };

  if (!roomId) {
    return <Menu onJoinRoom={handleJoinRoom} playerId={playerId} />;
  }

  return (
    <div className="App">
      <h1>¿Quién es quién? - Sala {roomId}</h1>
      <div className="game-container">
        <GameBoard
          setSelectedCharacter={setSelectedCharacter}
          isSelecting={isSelecting}
          setIsSelecting={setIsSelecting}
          roomId={roomId}
          playerId={playerId}
        />
        <div className="sidebar">
          <Chat roomId={roomId} />
          <GuessWinner
            selectedCharacter={selectedCharacter}
            setIsSelecting={setIsSelecting}
            roomId={roomId}
            playerId={playerId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;