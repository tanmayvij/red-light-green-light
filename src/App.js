import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import doll from "./assets/doll.jpg";
import player from "./assets/player.png";
import red from "./assets/red.mp3";
import green from "./assets/green.mp3";

function App() {
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [timer, updateTimer] = useState();
  const [pos, setPos] = useState(60);

  useEffect(() => {
    const handler = (e) => {
      if (['ArrowRight', 'ArrowLeft'].includes(e.code) && status === 'red') {
        return endGame(false);
      }

      if (e.code === 'ArrowRight') {
        setPos(pos + 10);
        let d = document.getElementById('player');
        d.style.left = `${pos}px`;
      } else if (e.code === 'ArrowLeft' && pos >= 70) {
        setPos(pos - 10);
        let d = document.getElementById('player');
        d.style.left = `${pos}px`;
      }

      if (pos > (window.innerWidth - 60 - 110)) {
        return endGame(true);
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  })

  const changeStatus = useCallback((newStatus) => {
    setStatus(newStatus);
    let clip = new Audio(newStatus === "red" ? red : green);
    clip.loop = false;
    clip.load();
    clip.play();

    let newTimer = setTimeout(() => changeStatus(newStatus === "red" ? "green" : "red"), Math.floor(Math.random() * 5000) + 3000);
    updateTimer(newTimer);
  }, [status]);

  const startGame = () => {
    setStarted(true);
    alert("Press arrow keys to move. Stop when red light is announced. Move to the finish point to complete the game.");
    changeStatus("red");
  }

  const endGame = (success) => {
    if (success) {
      alert("Congratulations! You cleared it successfully.");
    } else {
      alert("Oops! You were supposed to stop.")
    }
    setStatus("");
    setPos(60);
    setStarted(false);
    clearTimeout(timer);
  }

  return (
    <div className="App">
      <h1 className="heading">
        <span className="fnt-red">Red </span>
        Light,
        <span className="fnt-green"> Green </span>
        Light
      </h1>
      {
        started ?
        (
          <div className="container">
            <div className="flex-center top-section">
              <div className="doll-img">
                <img src={doll} alt="Doll" onClick={() => endGame(true) } />
              </div>
              <div className={`light ${status}`}></div>
            </div>

            <div className="flex-center">
              <div className="startPoint">
                <p>Start</p>
              </div>
              <img id="player" src={player} alt="Player" />
              <div className="endPoint">
                <p>Finish</p>
              </div>
            </div>
          </div>
        ) :
        (
          <div className="start-btn">
            <button onClick={startGame}>Play Now</button>
          </div>
        )
      }
    </div>
  );
}

export default App;
