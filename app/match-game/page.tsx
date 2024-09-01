"use client";

import React, { useState, useEffect } from 'react';

const DIRECTIONS = ['up', 'down', 'left', 'right'];

const MatchGame = () => {
  const [MATCH_COUNT, setMATCH_COUNT] = useState<number>(5);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'memorize' | 'answer' | 'result'>('waiting');
  const [matches, setMatches] = useState<Array<{ direction: string; position: { top: number; left: number } }>>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  });
  const [score, setScore] = useState<number | null>(null);

  const startGame = () => {
    generateMatches();
    setGameStatus('memorize');
    setTimeout(() => setGameStatus('answer'), 5000); // Show matches for 5 seconds
  };

  const handleAnswerChange = (direction: string, value: number) => {
    setUserAnswers(prev => ({ ...prev, [direction]: value }));
  };

  const checkAnswers = () => {
    const correctAnswers = matches.reduce((acc, match) => {
      acc[match.direction] = (acc[match.direction] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  
    const calculatedScore = DIRECTIONS.reduce((acc, direction) => {
      return acc + Math.min(userAnswers[direction], correctAnswers[direction] || 0);
    }, 0);
  
    setScore(calculatedScore);
    setGameStatus('result');
  };
  const generateMatches = () => {
    const newMatches: Array<{ direction: string; position: { top: number; left: number } }> = [];
    const occupiedPositions: Array<{ top: number; left: number }> = [];
  
    for (let i = 0; i < MATCH_COUNT; i++) {
      let newPosition;
      do {
        newPosition = {
          top: Math.random() * 70 + 5, // Random top position between 10% and 90%
          left: Math.random() * 20 + 40 // Random left position between 10% and 90%
        };
      } while (isOverlapping(newPosition, occupiedPositions));
  
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      newMatches.push({ direction, position: newPosition });
      occupiedPositions.push(newPosition);
    }
  
    setMatches(newMatches);
  };
  
  const isOverlapping = (newPosition: { top: number; left: number }, occupiedPositions: Array<{ top: number; left: number }>) => {
    const minDistance = 1; // Minimum distance between match centers in percentage
    return occupiedPositions.some(pos => 
      Math.sqrt(Math.pow(pos.top - newPosition.top, 2) + Math.pow(pos.left - newPosition.left, 2)) < minDistance
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24">
      <h1 className="text-4xl font-bold mb-8">Memorize the Position of Matches</h1>
      
      {gameStatus === 'waiting' && (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={startGame}
          >
            Start Game
          </button>
          <p>Set numbers of matches to show</p>
          <input
            type="number"
            min="5"
            max="20"
            value={MATCH_COUNT}
            onChange={(e) => setMATCH_COUNT(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </>
      )}

      {gameStatus === 'memorize' && (
        <div className="relative w-full h-[600px] bg-amber-100 rounded-lg shadow-inner">
          {matches.map((match, index) => {
            const randomRotation = Math.floor(Math.random() * 41) - 20; // Random number between -20 and 20
            let rotation = 0;
            switch (match.direction) {
              case 'up': rotation = 0 + randomRotation; break;
              case 'down': rotation = 180 + randomRotation; break;
              case 'left': rotation = -90 + randomRotation; break;
              case 'right': rotation = 90 + randomRotation; break;
            }
            return (
              <div
                key={index}
                className="absolute w-[20px] h-32 bg-contain bg-no-repeat bg-center"
                style={{ 
                  transform: `rotate(${rotation}deg) translate(-50%, -50%)`,
                  top: `${match.position.top}%`,
                  left: `${match.position.left}%`,
                }}
              >
                <img 
                  src="/resources/match.webp" 
                  alt="match"
                  style={{
                    filter: 'drop-shadow(0px 0px 6px rgba(0,0,0,.19))',
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
            );
          })}
        </div>
      )}

      {gameStatus === 'answer' && (
        <div className="space-y-4">
          {DIRECTIONS.map(direction => (
            <div key={direction} className="flex items-center">
              <label className="mr-2">{direction}:</label>
              <input
                type="number"
                min="0"
                max={MATCH_COUNT}
                value={userAnswers[direction]}
                onChange={(e) => handleAnswerChange(direction, parseInt(e.target.value))}
                className="border rounded px-2 py-1"
              />
            </div>
          ))}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={checkAnswers}
          >
            Submit Answers
          </button>
        </div>
      )}

      {gameStatus === 'result' && score !== null && (
        <div>
          <p>Game Over! Here are the correct answers:</p>
          {DIRECTIONS.map(direction => (
            <p key={direction}>{direction}: {matches.filter(m => m.direction === direction).length}</p>
          ))}
          <p>Your score: {score} out of {MATCH_COUNT}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => {
              setGameStatus('waiting');
              setScore(null);
              setMatches([]);
              setUserAnswers({ up: 0, down: 0, left: 0, right: 0 });
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
};

export default MatchGame;