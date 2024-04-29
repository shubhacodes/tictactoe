import React, { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];


function TicTacToe() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState("");
  const [gameState, setGameState] = useState(GameState.inProgress);
  const [isGameActive, setIsGameActive] = useState(false);

  // Initialization of the sound assets
  const gameOverSound = new Audio(gameOverSoundAsset);
  gameOverSound.volume = 0.2;
  const clickSound = new Audio(clickSoundAsset);
  clickSound.volume = 0.5;

  useEffect(() => {
    if (isGameActive) {
      checkWinner(tiles, setStrikeClass, setGameState);
    }
  }, [tiles, isGameActive]);
  
  useEffect(() => {
    let recognition;
    if (isGameActive) {
      recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onresult = function(event) {
        const command = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
        handleVoiceCommand(command);
      };

      recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
      };

      recognition.start();
    }

    // Clean up function to stop recognition when the component unmounts or isGameActive changes
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isGameActive]);


  useEffect(() => {
    console.log(`Player turn is now: ${playerTurn}, updating game state accordingly.`);
    // Additional logic that depends on playerTurn
  }, [playerTurn]);
  
  useEffect(() => {
    console.log(`Tiles updated: ${tiles.join(",")}`);
    // Logic to handle tile updates, like checking for a winner
  }, [tiles]);
  
  

  const handleGameStart = () => {
    clickSound.play(); // Play a sound on interaction to unlock audio
    setIsGameActive(true); // Set the game to active
  };

  const handleVoiceCommand = (command) => {
    console.log("Voice command received:", command);
    const match = command.match(/cell (\d+)/); // Match the word "cell" followed by a number
    if (match) {
      const cellNumber = parseInt(match[1], 10); // Parse the cell number
      if(cellNumber >= 1 && cellNumber <= 9) {
        handleTileClick(cellNumber - 1); // Convert cell number to zero-based index
      } else {
        console.error("Cell number is out of bounds"); // Error handling for numbers outside 1-9
      }
    }
  };

  const handleTileClick = (index) => {
    if (gameState !== GameState.inProgress || tiles[index] !== null) {
      console.log("Click ignored:", { gameState, tileValue: tiles[index] });
      return;
    }
  
    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
  
    const nextPlayer = playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X;
    console.log(`Tile ${index} set to ${playerTurn}. Setting next player to ${nextPlayer}`);
    setPlayerTurn(nextPlayer);
  };
  
  
  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass("");
    setIsGameActive(false);
  };

  const checkWinner = (currentTiles, setCurrentStrikeClass, setCurrentGameState) => {
    for (const { combo, strikeClass: currentStrikeClass } of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentTiles[a] &&
        currentTiles[a] === currentTiles[b] &&
        currentTiles[a] === currentTiles[c]
      ) {
        setCurrentStrikeClass(currentStrikeClass);
        setCurrentGameState(
          currentTiles[a] === PLAYER_X ? GameState.playerXWins : GameState.playerOWins
        );
        return;
      }
    }

    if (!currentTiles.includes(null)) {
      setCurrentGameState(GameState.draw);
    }
  };

  return (
    <div>
      {!isGameActive ? (
        <button onClick={handleGameStart} className="start-button">Tap to Begin</button>
      ) : (
        <>
          <h1>Tic Tac Toe</h1>
          <Board
            tiles={tiles}
            onTileClick={handleTileClick}
            playerTurn={playerTurn}
            strikeClass={strikeClass}
          />
          <GameOver gameState={gameState} />
          <Reset gameState={gameState} onReset={handleReset} />
        </>
      )}
    </div>
  );
}

export default TicTacToe;
