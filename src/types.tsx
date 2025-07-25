// src/types.tsx
export interface Character {
  id: number;
  name: string;
  image: string;
  isSelected?: boolean;
}

export interface Room {
  id: string;
  players: string[];
  secretCharacters: { [playerId: string]: Character };
  markedCharactersByPlayer: { [playerId: string]: number[] };
  guessedCharacter?: Character;
  createdAt: number;
  gameState: "playing" | "finished";
  winnerId?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  playerId: string;
}