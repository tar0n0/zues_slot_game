import { useEffect, useState } from "react";
import "./style.css";

export default function MobileStartPopup() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Показать popup ТОЛЬКО на мобильных
        if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
            setShow(true);
        }
    }, []);

    if (!show) return null;

    return (
        <div className="mobile-start-popup">
            <div className="mobile-start-popup-content">
                <p>
                    I had very, very limited time and couldn’t test all cases and devices.
                    If something goes wrong, please reload the page and continue.
                    <br/>
                    <br/>
                    Click OK to view the test task.
                </p>

                <button onClick={() => setShow(false)}>OK</button>
            </div>
        </div>
    );
}
