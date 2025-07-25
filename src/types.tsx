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
  markedCharactersByPlayer: { [playerId: string]: number[] }; // Marcados por jugador
  guessedCharacter?: Character;
  createdAt: number;
}