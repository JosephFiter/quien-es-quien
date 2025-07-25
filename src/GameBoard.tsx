// src/components/GameBoard.tsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Character } from "./types";
import "./GameBoard.css";

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
  { id: 38, name: "Oli gucken", image: "https://via.placeholder.com/100?text=oligucken" },
  { id: 39, name: "Sz", image: "https://via.placeholder.com/100?text=Sz" },
  { id: 40, name: "Raizman", image: "https://via.placeholder.com/100?text=Raizman" },
];


interface GameBoardProps {
  setSelectedCharacter: (char: Character | null) => void;
  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
  roomId: string;
  playerId: string;
  onReturnToMenu: () => void;
}

function GameBoard({ setSelectedCharacter, isSelecting, setIsSelecting, roomId, playerId, onReturnToMenu }: GameBoardProps) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [opponentSecretCharacter, setOpponentSecretCharacter] = useState<Character | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [gameState, setGameState] = useState<"playing" | "finished">("playing");

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (data && data.players && data.secretCharacters) {
        const otherPlayerId = data.players.find((id: string) => id !== playerId);
        setOpponentSecretCharacter(otherPlayerId ? data.secretCharacters[otherPlayerId] : null);
        const markedIds = data.markedCharactersByPlayer?.[playerId] || [];
        setCharacters(
          initialCharacters.map((char) => ({
            ...char,
            isSelected: markedIds.includes(char.id),
          }))
        );
        setGameState(data.gameState || "playing");
        if (data.gameState === "finished" && data.winnerId) {
          setGameResult(data.winnerId === playerId ? "win" : "lose");
          setTimeout(() => {
            onReturnToMenu();
          }, 3000);
        }
      }
    });
    return () => unsubscribe();
  }, [roomId, playerId, onReturnToMenu]);

  const toggleCharacterSelection = async (id: number) => {
    if (gameState !== "playing") return;
    const roomRef = doc(db, "rooms", roomId);
    const newCharacters = characters.map((char) =>
      char.id === id ? { ...char, isSelected: !char.isSelected } : char
    );
    setCharacters(newCharacters);
    const markedIds = newCharacters.filter((char) => char.isSelected).map((char) => char.id);
    await updateDoc(roomRef, {
      [`markedCharactersByPlayer.${playerId}`]: markedIds,
    });
  };

  const handleCharacterClick = (char: Character) => {
    if (gameState !== "playing") return;
    if (isSelecting) {
      setSelectedCharacter(char);
      setIsSelecting(false);
    } else {
      toggleCharacterSelection(char.id);
    }
  };

  return (
    <div className="game-board">
      {gameResult && (
        <div className={`game-result ${gameResult}`}>
          <h2>{gameResult === "win" ? "¡Ganaste!" : "Perdiste"}</h2>
          <p>Volverás al menú en unos segundos...</p>
        </div>
      )}
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