import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [score, setScore] = useState(0); // Player's score
  const [gameOver, setGameOver] = useState(false); // Game over state
  const [targetPosition, setTargetPosition] = useState({ left: 50, top: 50 }); // Position of target
  const [timeLeft, setTimeLeft] = useState(30); // Time left for the game
  
  const gameTimerRef = useRef(null); // Ref to track game timer
  const targetTimerRef = useRef(null); // Ref to track target spawn timer

  // Function to handle clicking on the target
  const handleClickTarget = () => {
    if (gameOver) return;
    setScore(score + 1); // Increase score
    moveTarget(); // Move the target after every click
  };

  // Function to move the target to a new random position
  const moveTarget = () => {
    const newLeft = Math.random() * 90; // Random horizontal position (0-90%)
    const newTop = Math.random() * 90; // Random vertical position (0-90%)
    setTargetPosition({ left: newLeft, top: newTop });
  };

  // Function to start a new game
  const startGame = () => {
    setScore(0); // Reset score
    setTimeLeft(30); // Set initial time
    setGameOver(false); // Set gameOver state to false

    // Start the game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(gameTimerRef.current);
          setGameOver(true); // End the game when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Start the target spawn timer
    targetTimerRef.current = setInterval(() => {
      if (!gameOver) {
        moveTarget(); // Move target every second
      }
    }, 1000);
  };

  useEffect(() => {
    // Automatically start the game when the component mounts
    startGame();

    return () => {
      // Cleanup intervals when the component unmounts
      clearInterval(gameTimerRef.current);
      clearInterval(targetTimerRef.current);
    };
  }, []);

  return (
    <div className="game-container">
      <h1>Click the Target Game</h1>
      <div className="score-board">
        <span>Score: {score}</span>
        <span>Time Left: {timeLeft}s</span>
      </div>
      <div className="game-area" onClick={handleClickTarget}>
        {!gameOver && (
          <div
            className="target"
            style={{
              left: `${targetPosition.left}%`,
              top: `${targetPosition.top}%`,
            }}
          ></div>
        )}
      </div>
      {gameOver && <div className="game-over">Game Over! Final Score: {score}</div>}
    </div>
  );
};

export default App;
