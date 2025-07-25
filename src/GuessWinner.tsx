// src/components/GuessWinner.tsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
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
    const isCorrect = selectedCharacter.id === mySecretCharacter.id;
    const roomRef = doc(db, "rooms", roomId);
    await setDoc(roomRef, { guessedCharacter: selectedCharacter }, { merge: true });
    alert(isCorrect ? "¡Correcto! Ganaste." : "Incorrecto, intenta de nuevo.");
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