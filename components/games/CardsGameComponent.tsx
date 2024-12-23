"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Card {
  id: number;
  number: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Props {
  numberOfPairs: number;
}

export default function CardsGameComponent({ numberOfPairs }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  // Initialize cards
  useEffect(() => {
    const newCards: Card[] = [];
    for (let i = 1; i <= numberOfPairs; i++) {
      // Create pairs of cards
      newCards.push(
        { id: i * 2 - 1, number: i, isFlipped: false, isMatched: false },
        { id: i * 2, number: i, isFlipped: false, isMatched: false }
      );
    }
    // Shuffle cards
    setCards(newCards.sort(() => Math.random() - 0.5));
  }, [numberOfPairs]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return; // Prevent flipping more than 2 cards
    
    const newCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    
    setFlippedCards([...flippedCards, id]);

    // Check for match when two cards are flipped
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCard = cards.find(card => card.id === flippedCards[0])!;
      const secondCard = cards.find(card => card.id === id)!;

      if (firstCard.number === secondCard.number) {
        // Match found
        setTimeout(() => {
          setCards(cards => cards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          ));
          setFlippedCards([]);
          setMatches(prev => prev + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards => cards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        Moves: {moves} | Matches: {matches}/{numberOfPairs}
      </div>
      <table className="table-fixed w-full max-w-3xl">
        <tbody>
          {Array.from({ length: Math.ceil(cards.length / (numberOfPairs <= 6 ? 4 : 6)) }).map((_, rowIndex) => (
            <tr key={rowIndex} className="gap-1">
              {cards
              .slice(
                rowIndex * (numberOfPairs <= 6 ? 4 : 6), 
                (rowIndex + 1) * (numberOfPairs <= 6 ? 4 : 6)
              )
              .map(card => (
                <td key={card.id} className="">
                  <div
                    onClick={() => !card.isFlipped && !card.isMatched && handleCardClick(card.id)}
                    className={`
                      w-full h-[120px]
                      cursor-pointer 
                      rounded-lg 
                      relative
                      ${card.isFlipped || card.isMatched 
                        ? 'flipped' 
                        : 'card-paused'}
                      ${card.isMatched ? 'opacity-50' : ''}
                    `}
                  >
                    
                    <div className="transition-all absolute top-0 left-0 w-full h-full bg-gray-500">
                      <Image src={`/resources/cards/${card.number}.webp`} alt={`Card Back ${card.number}`} className="w-full h-full object-contain" width={100} height={100} />
                    </div>
                    <div className="transition-all absolute top-0 left-0 w-full h-full bg-black"></div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


type Level = "easy" | "medium" | "hard";

export function LevelSelector() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const levels = {
    easy: 6,    // 6 pairs = 12 cards
    medium: 12, // 12 pairs = 24 cards
    hard: 21,   // 21 pairs = 42 cards
  };

  if (!selectedLevel) {
    return (
      <div className="flex gap-4">
        {(Object.keys(levels) as Level[]).map((level) => (
          <button
            key={level}
            className="px-6 py-3 text-lg font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            onClick={() => setSelectedLevel(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <CardsGameComponent numberOfPairs={levels[selectedLevel]} />
      <button
        className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        onClick={() => setSelectedLevel(null)}
      >
        Change Level
      </button>
    </>
  );
}