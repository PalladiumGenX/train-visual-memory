"use client";

import { useState, useEffect, useRef } from "react";

const moveSounds = {
  up: '/up.mp3',
  down: '/down.mp3',
  left: '/left.mp3',
  right: '/right.mp3',
};
const GRID_SIZE = 5;
const DIRECTIONS = ["up", "down", "left", "right"];

export default function BugGame() {
  const [bugPosition, setBugPosition] = useState<[number, number] | null>(null);
  const [gameStatus, setGameStatus] = useState<"waiting" | "showGrid" | "playing" | "won" | "lost">("waiting");
  const [currentMove, setCurrentMove] = useState<string | null>(null);
  const [showFinalGrid, setShowFinalGrid] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const currentBugPositionRef = useRef<[number, number] | null>(null);
  const pathRef = useRef<string[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const waitingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    if (gameStatus === "showGrid") {
      const initialPosition: [number, number] = [2,2];
      setBugPosition(initialPosition);
      currentBugPositionRef.current = initialPosition;
      console.log("Initial bug position:", initialPosition);
    } else if (gameStatus === "playing") {
      const moveInterval = setInterval(() => {
        checkAndMove();
      }, 2000);

      return () => {
        clearInterval(moveInterval);
        if (waitingTimeoutRef.current) {
          clearTimeout(waitingTimeoutRef.current);
        }
      };
    }
  }, [gameStatus]);

  const startGame = () => {
    setGameStatus("showGrid");
  };

  const startPlaying = () => {
    setGameStatus("playing");
  };

  const checkAndMove = () => {
    if (isWaiting) return;

    const [x, y] = currentBugPositionRef.current || [0, 0];
    if (x === -1 || x === GRID_SIZE || y === -1 || y === GRID_SIZE) {
      setIsWaiting(true);
      waitingTimeoutRef.current = setTimeout(() => {
        setGameStatus("lost");
        setShowFinalGrid(true);
      }, 3000);
    } else {
      moveBug();
    }
  };

  const initializeAudio = () => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioInitialized(true);
  };

  const playSound = (soundUrl: string) => {
    if (!audioContextRef.current || !audioInitialized) return;

    fetch(soundUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContextRef.current!.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = audioContextRef.current!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current!.destination);
        source.start(0);
      })
      .catch(error => console.error('Error playing audio:', error));
  };

  const moveBug = () => {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    setCurrentMove(direction);
    setMoveHistory(prev => [...prev, direction]);
  
    // Play the sound for the move
    playSound(moveSounds[direction as keyof typeof moveSounds]);
  
    if (currentBugPositionRef.current) {
      const [x, y] = currentBugPositionRef.current;
      let newX = x, newY = y;
  
      switch (direction) {
        case "up": newY = Math.max(y - 1, -1); break;
        case "down": newY = Math.min(y + 1, GRID_SIZE); break;
        case "left": newX = Math.max(x - 1, -1); break;
        case "right": newX = Math.min(x + 1, GRID_SIZE); break;
      }
  
      const newPosition: [number, number] = [newX, newY];
      currentBugPositionRef.current = newPosition;
      setBugPosition(newPosition);
      console.log("New bug position:", newPosition);
    }
  };

  const checkBugEscape = () => {
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
    }
    setIsWaiting(false);

    if (!currentBugPositionRef.current) return;
    
    const [x, y] = currentBugPositionRef.current;
    console.log("Current bug position: x:" + x + " y:" + y);
    if (x === -1 || x === GRID_SIZE || y === -1 || y === GRID_SIZE) {
      setGameStatus("won");
    } else {
      setGameStatus("lost");
    }
    setShowFinalGrid(true);
  };

  const renderGrid = (position: [number, number] | null) => {
    return (
      <div className="grid grid-cols-7 gap-1 mb-4">        
        {Array.from({ length: (GRID_SIZE + 2) * (GRID_SIZE + 2) }).map((_, index) => {
           const x = index % (GRID_SIZE + 2) - 1;
           const y = Math.floor(index / (GRID_SIZE + 2)) - 1;
           const isInsideGrid = x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
           const isBugHere = position && position[0] === x && position[1] === y;
           
           return (
             <div 
               key={index} 
               className={`w-10 h-10 ${isInsideGrid ? 'border bg-gray-200' : ''} ${
                 isBugHere ? 'bug-here' : ''
               }`}
             ></div>
           );
        })}
      </div>
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && gameStatus === 'playing') {
        checkBugEscape();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStatus]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24">
      {!audioInitialized && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={initializeAudio}
        >
          Turn on sound (recommended)
        </button>
      )}
      <h1 className="text-4xl font-bold mb-8">The Bug Game</h1>
      {gameStatus === "waiting" && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startGame}
        >
          Start Game
        </button>
      )}
      {gameStatus === "showGrid" && (
        <div>
          <p>Memorize the bug's position <br/>then close your eyes!</p>
          <div className="w-auto mx-auto">
            {renderGrid(bugPosition)}
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={startPlaying}
          >
            Start Playing
          </button>
        </div>
      )}
      {gameStatus === "playing" && (
        <div>
          <p className="text-xl mb-4">The bug moved: {currentMove}</p>
          <div className="hidden">{renderGrid(bugPosition)}</div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={checkBugEscape}
          >
            Bug Escaped! (or press Spacebar)
          </button>
        </div>
      )}
      {(gameStatus === "won" || gameStatus === "lost") && (
        <div>
          <p>{gameStatus === "won" ? "You won!" : "You lost!"}</p>
          {showFinalGrid && (
            <div>
              <p>Final bug position:</p>
              {renderGrid(bugPosition)}
             {/*  <div className="mt-4">
                <p>Move history:</p>
                <ul className="list-disc list-inside">
                  {moveHistory.map((move, index) => (
                    <li key={index}>{move}</li>
                  ))}
                </ul>
              </div> */}
            </div>
          )}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => {
              setGameStatus("waiting");
              setShowFinalGrid(false);
              setMoveHistory([]);
              setBugPosition(null);
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}