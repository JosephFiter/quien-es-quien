// src/components/GameBoard.tsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Character } from "./types";
import "./GameBoard.css";

const initialCharacters: Character[] = [
  { id: 1, name: "Juan", image: "https://via.placeholder.com/100?text=Juan" },
  { id: 2, name: "María", image: "https://via.placeholder.com/100?text=María" },
  { id: 3, name: "Pedro", image: "https://via.placeholder.com/100?text=Pedro" },
];

interface GameBoardProps {
  setSelectedCharacter: (char: Character | null) => void;
  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
  roomId: string;
  playerId: string;
}

function GameBoard({ setSelectedCharacter, isSelecting, setIsSelecting, roomId, playerId }: GameBoardProps) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [opponentSecretCharacter, setOpponentSecretCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (data && data.players && data.secretCharacters) {
        const otherPlayerId = data.players.find((id: string) => id !== playerId); // Encontramos al otro jugador
        setOpponentSecretCharacter(otherPlayerId ? data.secretCharacters[otherPlayerId] : null);
        const markedIds = data.markedCharacters || [];
        setCharacters(
          initialCharacters.map((char) => ({
            ...char,
            isSelected: markedIds.includes(char.id),
          }))
        );
      }
    });
    return () => unsubscribe();
  }, [roomId, playerId]);

  const toggleCharacterSelection = async (id: number) => {
    const roomRef = doc(db, "rooms", roomId);
    const newCharacters = characters.map((char) =>
      char.id === id ? { ...char, isSelected: !char.isSelected } : char
    );
    setCharacters(newCharacters);
    const markedIds = newCharacters.filter((char) => char.isSelected).map((char) => char.id);
    await updateDoc(roomRef, { markedCharacters: markedIds });
  };

  const handleCharacterClick = (char: Character) => {
    if (isSelecting) {
      setSelectedCharacter(char);
      setIsSelecting(false);
    } else {
      toggleCharacterSelection(char.id);
    }
  };

  return (
    <div className="game-board">
      <div className="secret-character">
        <h2>Personaje secreto del oponente:</h2>
        {opponentSecretCharacter ? (
          <div className="secret-card">
            <img src={opponentSecretCharacter.image} alt={opponentSecretCharacter.name} className="character-image" />
            <p>{opponentSecretCharacter.name}</p>
          </div>
        ) : (
          <p>Esperando al oponente...</p>
        )}
      </div>
      <div className="character-grid">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`character-card ${char.isSelected ? "selected" : ""} ${isSelecting ? "selecting" : ""}`}
            onClick={() => handleCharacterClick(char)}
          >
            <img src={char.image} alt={char.name} className="character-image" />
            <p>{char.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;