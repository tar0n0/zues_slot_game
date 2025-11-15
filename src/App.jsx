import { useEffect, useState, useRef } from "react";
import Popup from "./components/Popup";
import "./App.css";
import { Header } from "./components/Header.jsx";
import SlotMachine from "./components/SlotMachine.jsx";
import SpinButton from "./components/spinButton/index.jsx";

export default function App() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [boardPos, setBoardPos] = useState(null);
    const boardRef = useRef(null); // <--- добавлено

    function startSpin() {
        if (isSpinning) return;
        setIsSpinning(true);
    }

    function spinFinished() {
        setIsSpinning(false);
        setShowPopup(true);
    }

    return (
        <div className="app">
            <div className="content">
                <Header />

                <div className="zeus-container">
                    <img src="/assets/zeus.png" className="zeus-img" alt="Zeus" />
                </div>

                {/* 🎰 SLOT BOARD OVERLAY */}
                <div className="slot-board-overlay" ref={boardRef}>
                    <SlotMachine
                        isSpinning={isSpinning}
                        onSpinEnd={spinFinished}
                        onBoardPosition={setBoardPos}
                    />
                </div>

                {/* 🎰 SPIN BUTTON */}
                <SpinButton boardRef={boardRef} onClick={startSpin} boardPos={boardPos} />
            </div>

            {showPopup && <Popup onClose={() => setShowPopup(false)} />}
        </div>
    );
}
