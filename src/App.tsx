// src/App.tsx
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
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
  const [playerId] = useState<string>(uuidv4());
  const [gameState, setGameState] = useState<"playing" | "finished">("playing");

  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (data) {
        setGameState(data.gameState || "playing");
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
  };

  const handleReturnToMenu = () => {
    setRoomId(null);
    setSelectedCharacter(null);
    setIsSelecting(false);
    setGameState("playing");
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
          onReturnToMenu={handleReturnToMenu}
        />
        <div className="sidebar">
          <Chat roomId={roomId} playerId={playerId} gameState={gameState} />
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