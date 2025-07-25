// src/components/GuessWinner.tsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { Character } from "./types";

interface GuessWinnerProps {
  selectedCharacter: Character | null;
  setIsSelecting: (value: boolean) => void;
  roomId: string;
  playerId: string;
}

function GuessWinner({ selectedCharacter, setIsSelecting, roomId, playerId }: GuessWinnerProps) {
  const [mySecretCharacter, setMySecretCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (data) {
        setMySecretCharacter(data.secretCharacters?.[playerId] || null);
      }
    });
    return () => unsubscribe();
  }, [roomId, playerId]);

  const guessWinner = async () => {
    if (!selectedCharacter) {
      alert("Selecciona un personaje primero con el botón 'Seleccionar'.");
      return;
    }
    if (!mySecretCharacter) return;
    const roomRef = doc(db, "rooms", roomId);
    const isCorrect = selectedCharacter.id === mySecretCharacter.id;
    const winnerId = isCorrect ? playerId : (await getDoc(roomRef)).data()?.players.find((id: string) => id !== playerId);
    await setDoc(
      roomRef,
      {
        guessedCharacter: selectedCharacter,
        gameState: "finished",
        winnerId,
      },
      { merge: true }
    );
  };

  const startSelecting = () => {
    setIsSelecting(true);
  };

  return (
    <div>
      <h2>Arriesga tu ganador</h2>
      <p>Personaje seleccionado: {selectedCharacter?.name || "Ninguno"}</p>
      <button onClick={startSelecting}>Seleccionar</button>
      <button onClick={guessWinner}>Arriesgar</button>
    </div>
  );
}

export default GuessWinner;