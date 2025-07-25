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
  secretCharacters: { [playerId: string]: Character }; // Personaje secreto de cada jugador
  markedCharacters: number[];
  guessedCharacter?: Character;
  createdAt: number;
}