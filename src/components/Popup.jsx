import { useEffect } from "react";
import gsap from "gsap";
import "./Popup.css";

import logo from "/assets/popup/Logo.png";
import bonus from "/assets/popup/Bonus.png";
import button from "/assets/popup/Button.png";

export default function Popup({ onClose }) {

    useEffect(() => {
        // Pulse animation for button
        gsap.to(".popup-button", {
            scale: 1.05,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        // Bubbling effect
        gsap.to(".bubble", {
            y: -40,
            opacity: 0,
            scale: 1.8,
            duration: 1.2,
            repeat: -1,
            stagger: 0.3,
            ease: "power1.out"
        });
    }, []);

    return (
        <div className="popup">
            <div className="popup-box">

                <div className="logo-container-pop-up">
                    <img className="popup-logo" src={logo} />
                </div>

                <div className="content-container">
                    <div className="bonus-text">
                        <img className="popup-bonus" src={bonus} />
                    </div>

                    <div className="button-part">
                        {/* bubbles */}
                        <div className="bubble b1"></div>
                        <div className="bubble b2"></div>
                        <div className="bubble b3"></div>
                        <img
                            className="popup-button"
                            src={button}
                            alt="Claim Now Button"
                            onClick={onClose}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
}
