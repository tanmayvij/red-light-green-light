import React, { useState, useEffect, useCallback } from "react";
import SweetAlert from "sweetalert2-react";
import "./App.css";
import doll from "./assets/doll.jpg";
import player from "./assets/player.png";
import red from "./assets/red.mp3";
import green from "./assets/green.mp3";
import left from "./assets/left.png";
import right from "./assets/right.png";

function App() {
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [timer, updateTimer] = useState();
  const [pos, setPos] = useState(60);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (["ArrowRight", "ArrowLeft"].includes(e.code) && status === "red") {
        return endGame(false);
      }

      if (e.code === "ArrowRight") {
        setPos(pos + 5);
        let d = document.getElementById("player");
        d.style.left = `${pos}px`;
      } else if (e.code === "ArrowLeft" && pos >= 65) {
        setPos(pos - 5);
        let d = document.getElementById("player");
        d.style.left = `${pos}px`;
      }

      if (pos > (window.innerWidth - 60 - 110)) {
        return endGame(true);
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  });

  const scrollMobile = useCallback(() => {
    if(window.innerWidth < 768) {
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }, 500);
    }
  }, []);

  const changeStatus = useCallback((newStatus) => {
    setStatus(newStatus);
    let clip = new Audio(newStatus === "red" ? red : green);
    clip.loop = false;
    clip.load();
    clip.play();

    let newTimer = setTimeout(() => changeStatus(newStatus === "red" ? "green" : "red"), Math.floor(Math.random() * 5000) + 3000);
    updateTimer(newTimer);
  }, [status]);

  const moveRight = () => {
    if(status === "red") {
      return endGame(false);
    }

    setPos(pos + 5);
    let d = document.getElementById("player");
    d.style.left = `${pos}px`;

    if (pos > (window.innerWidth - 60 - 110)) {
      return endGame(true);
    }
  }

  const moveLeft = () => {
    if(status === "red") {
      return endGame(false);
    }
    
    if(pos >= 65) {
      setPos(pos - 5);
      let d = document.getElementById("player");
      d.style.left = `${pos}px`;
    }
  }

  const startGame = () => {
    setShowWelcome(false);
    setStarted(true);
    scrollMobile();
    changeStatus("red");
  }

  const endGame = (success) => {
    if (success) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
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

            <div className="flex-center mobile">
              <img src={left} onClick={moveLeft} height="64" width="64" />
              <img src={right} onClick={moveRight} height="64" width="64" />
            </div>
          </div>
        ) :
        (
          <div className="start-btn">
            <button onClick={() => setShowWelcome(true)}>Play Now</button>
          </div>
        )
      }
      <SweetAlert
        show={showWelcome}
        title="Welcome"
        text="Press arrow keys to move. Stop when red light is announced. Move to the finish point to complete the game."
        onConfirm={startGame}
      />
      <SweetAlert
        show={showSuccess}
        type="success"
        title="Congratulations!"
        text="You successfully passed the game!"
        onConfirm={() => setShowSuccess(false)}
      />
      <SweetAlert
        show={showFailure}
        type="error"
        title="Better luck next time!"
        text="Oops! You were supposed to stop."
        onConfirm={() => setShowFailure(false)}
      />
    </div>
  );
}

export default App;
