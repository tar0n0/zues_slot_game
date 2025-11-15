import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.css";

export default function SpinButton({ boardRef, onClick }) {
    const btnRef = useRef(null);
    const bubblesRef = useRef([]);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        // ------------------------------
        // POSITIONING — как было
        // ------------------------------
        function updatePosition() {
            if (!boardRef.current) return;

            const rect = boardRef.current.getBoundingClientRect();
            const overlay = document.querySelector('.slot-board-overlay');

            let overlayRect = { height: 0, bottom: 0 };
            if (overlay) overlayRect = overlay.getBoundingClientRect();

            const insetInside = overlayRect.height * 0.21;
            const x = rect.left + rect.width / 2;
            const y = rect.bottom - insetInside;

            btn.style.left = `30%`;
            btn.style.top = `75%`;
        }

        window.addEventListener("resize", updatePosition);
        setTimeout(updatePosition, 120);

        // ------------------------------
        // ANIMATION: pulse
        // ------------------------------
        gsap.to(btn, {
            scale: 1.06,
            duration: 1.2,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut"
        });

        return () => {
            window.removeEventListener("resize", updatePosition);
        };
    }, []);

    // ---------------------------------------
    // GOLD BUBBLES — маленькие золотые вспышки
    // ---------------------------------------
    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        // создать 5 маленьких кружков
        for (let i = 0; i < 5; i++) {
            const bubble = document.createElement("div");
            bubble.className = "gold-bubble";
            btn.appendChild(bubble);
            bubblesRef.current.push(bubble);

            const delay = Math.random() * 2;

            gsap.fromTo(
                bubble,
                {
                    opacity: 0,
                    scale: 0.2,
                    x: (Math.random() - 0.5) * 30,
                    y: (Math.random() - 0.5) * 30
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1 + Math.random(),
                    repeat: -1,
                    yoyo: true,
                    delay,
                    x: (Math.random() - 0.5) * 20,
                    y: (Math.random() - 0.5) * 20,
                    ease: "sine.inOut"
                }
            );
        }
    }, []);

    return (
        <div ref={btnRef} className="spin-button-wrapper" onClick={onClick}>
            <img className="spin-base" src="/assets/SpinButtonFull.png" alt="spin"/>
        </div>
    );
}
