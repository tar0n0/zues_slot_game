import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

// === SPINE 3.8 ===
import "@pixi-spine/runtime-3.8";
import { Spine } from "pixi-spine";

const COLS = 6;
const ROWS = 4;
const SYMBOL = 110;

export default function SlotMachine({ isSpinning, onSpinEnd, onBoardPosition }) {
    const wrapperRef = useRef(null);
    const appRef = useRef(null);

    const reels = useRef([]);
    const symbolsTextures = useRef([]);

    const boardRef = useRef(null);
    const reelsConRef = useRef(null);

    const maskRef = useRef(null);

    const fireFrames = useRef([]); // <— храним FX рамки
    const targetStops = useRef([]); // <— выигрышная комбинация

    const coinRef = useRef(null);

    let handleResize = () => {};

    // ----------------------------
    // INIT
    // ----------------------------
    useEffect(() => {
        init();
        return () => {
            window.removeEventListener("resize", handleResize);
            appRef.current?.destroy(true, true);
        };
    }, []);

    async function init() {
        const wrap = wrapperRef.current;
        if (!wrap) return;

        const app = new PIXI.Application({
            resizeTo: wrap,
            backgroundAlpha: 0,
            antialias: true
        });

        appRef.current = app;
        wrap.appendChild(app.view);
        globalThis.__PIXI_APP__ = app;

        const loading = new PIXI.Text("Loading...", {
            fill: "#fff",
            fontSize: 28,
            fontWeight: "bold"
        });

        loading.anchor.set(0.5);
        loading.x = app.screen.width / 2;
        loading.y = app.screen.height / 2;
        app.stage.addChild(loading);

        PIXI.Assets.init({ basePath: "/assets" });

        // Load symbols
        const symbols = await PIXI.Assets.load(
            Array.from({ length: 10 }, (_, i) => `symbols/symbol${i + 1}.png`)
        );
        symbolsTextures.current = Object.values(symbols);

        // Load UI
        const frame = await PIXI.Assets.load("reelFrame.png");
        const base = await PIXI.Assets.load("Reel_Base.png");
        const divider = await PIXI.Assets.load("Divider.png");
        const bonus = await PIXI.Assets.load("BonusText.png");

        // SPINE coin
        const coinData = await PIXI.Assets.load("mobile/coins.json");
        const coin = new Spine(coinData.spineData || coinData);
        coin.visible = false;
        coin.scale.set(1);
        coinRef.current = coin;

        loading.destroy();

        // ---- BOARD ----
        const board = new PIXI.Container();
        boardRef.current = board;
        app.stage.addChild(board);

        const baseSpr = new PIXI.Sprite(base); baseSpr.anchor.set(0.5);
        const dividerSpr = new PIXI.Sprite(divider); dividerSpr.anchor.set(0.5);
        const frameSpr = new PIXI.Sprite(frame); frameSpr.anchor.set(0.5);

        board.addChild(baseSpr, dividerSpr, frameSpr);

        const bonusSpr = new PIXI.Sprite(bonus);
        bonusSpr.anchor.set(0.5);
        app.stage.addChild(bonusSpr);
        app.stage.addChild(coin);

        // ---- REELS ----
        const reelsCon = new PIXI.Container();
        reelsConRef.current = reelsCon;
        board.addChild(reelsCon);

        const mask = new PIXI.Graphics();
        maskRef.current = mask;
        board.addChild(mask);
        reelsCon.mask = mask;

        createReels();
        fillReels();

        handleResize = function resize() {
            const W = window.innerWidth;
            const scale = (W * 0.88) / frameSpr.texture.orig.width;

            board.x = W / 2;
            board.y = 210;

            frameSpr.scale.set(scale);
            baseSpr.scale.set(scale * 0.998);
            dividerSpr.scale.set(scale * 0.998);

            bonusSpr.scale.set(scale * 0.8);
            bonusSpr.x = W / 2;
            bonusSpr.y = board.y - frameSpr.height * 0.47;

            const frameW = frameSpr.width;
            const frameH = frameSpr.height;

            const innerW = frameW * 0.826;
            const innerH = frameH * 0.757;

            const xLeft = -frameW / 2 + frameW * 0.087;
            const yTop = -frameH / 2 + frameH * 0.115;

            reelsCon.x = xLeft - 2;
            reelsCon.y = yTop;

            reelsCon.scale.set((innerW / (COLS * SYMBOL)) * 1.05);

            mask.clear();
            mask.beginFill(0xffffff);
            mask.drawRect(xLeft - 30, yTop - 4, innerW + 59, innerH + 5);
            mask.endFill();

            if (onBoardPosition) {
                const globalTopLeft = app.stage.toGlobal({ x: board.x - frameSpr.width/2, y: board.y - frameSpr.height/2 });
                const globalBottom = app.stage.toGlobal({ x: board.x, y: board.y + frameSpr.height/2 });

                onBoardPosition({
                    top: globalTopLeft.y,
                    bottom: globalBottom.y,
                    centerX: globalBottom.x,
                    width: frameSpr.width     // <--- добавить
                });
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
    }

    // ----------------------------
    // CREATE REELS
    // ----------------------------
    function createReels() {
        reels.current = [];
        const offset = { 0: -30, 1: -30, 2: -21.5, 3: -14, 4: -5, 5: 8 };

        for (let c = 0; c < COLS; c++) {
            const col = new PIXI.Container();
            col.x = c * SYMBOL + offset[c];

            reelsConRef.current.addChild(col);

            reels.current.push({
                container: col,
                symbols: [],
                spinning: false,
                speed: 0
            });
        }
    }

    // ----------------------------
    // FILL SYMBOLS
    // ----------------------------
    function fillReels() {
        reels.current.forEach((reel) => {
            for (let r = 0; r < ROWS + 2; r++) {
                const tex = symbolsTextures.current[
                    Math.floor(Math.random() * symbolsTextures.current.length)
                    ];

                const sym = new PIXI.Sprite(tex);
                sym.width = sym.height = SYMBOL;
                sym.x = 0;
                sym.y = r * SYMBOL;

                reel.container.addChild(sym);
                reel.symbols.push(sym);
            }
        });
    }

    // ----------------------------
    // WIN GENERATION
    // ----------------------------
    function prepareWin() {
        const row = Math.floor(Math.random() * ROWS) ;
        const texIndex = Math.floor(Math.random() * symbolsTextures.current.length);
        const winTex = symbolsTextures.current[texIndex];

        targetStops.current = [];

        for (let c = 0; c < COLS; c++) {
            targetStops.current[c] = {
                row,
                texture: winTex
            };
        }
    }

    // ----------------------------
    // FORCE STOP EXACTLY ON WIN
    // ----------------------------
    function forceStopAtWin(reel, colIndex) {
        const { row, texture } = targetStops.current[colIndex];

        reel.symbols.sort((a, b) => a.y - b.y);

        reel.symbols[row].texture = texture;

        for (let i = 0; i < reel.symbols.length; i++) {
            reel.symbols[i].y = i * SYMBOL;
        }
    }

    // ----------------------------
    // FIRE FRAME FX
    // ----------------------------
    function addFireFrame(symbol) {
        const tex = PIXI.Texture.from("/assets/fire_frame.png");
        const fire = new PIXI.Sprite(tex);

        fire.anchor.set(0.5);
        fire.x = symbol.x + SYMBOL / 2;
        fire.y = symbol.y + SYMBOL / 2;
        fire.width = SYMBOL * 1.5;
        fire.height = SYMBOL * 1.5;

        symbol.parent.addChild(fire);

        gsap.to(fire, {
            alpha: 0.25,
            duration: 0.35,
            repeat: -1,
            yoyo: true
        });

        return fire;
    }

    function showFireFrames() {
        fireFrames.current.forEach((f) => f.destroy());
        fireFrames.current = [];

        const winRow = targetStops.current[0].row;

        for (let c = 0; c < COLS; c++) {
            const symbol = reels.current[c].symbols[winRow];
            const fx = addFireFrame(symbol);
            fireFrames.current.push(fx);
        }
    }

    function clearFireFrames() {
        fireFrames.current.forEach((f) => f.destroy());
        fireFrames.current = [];
    }

    // ----------------------------
    // COIN FX
    // ----------------------------
    function hideCoin() {
        const coin = coinRef.current;
        if (!coin) return;
        coin.visible = false;
        coin.state.clearTracks();
    }

    function showCoinAt(x, y) {
        const app = appRef.current;
        const coin = coinRef.current;
        if (!app || !coin) return;

        const pos = app.stage.toLocal({ x, y });

        coin.x = pos.x;
        coin.y = pos.y;
        coin.visible = true;

        coin.state.setAnimation(0, "coin_2", true);
    }

    // ----------------------------
    // SPIN TRIGGER
    // ----------------------------
    useEffect(() => {
        if (isSpinning) {
            clearFireFrames();
            prepareWin();
            startSpin();
        }
    }, [isSpinning]);

    // ----------------------------
    // START SPIN
    // ----------------------------
    function startSpin() {
        hideCoin();

        let stopped = 0;

        reels.current.forEach((r) => {
            r.spinning = true;
            r.speed = 60;
        });

        appRef.current.ticker.add(tick);

        reels.current.forEach((reel, i) => {
            setTimeout(() => {
                reel.spinning = false;

                forceStopAtWin(reel, i);

                stopped++;
                if (stopped === COLS) {
                    appRef.current.ticker.remove(tick);

                    showFireFrames(); // show FX on ALL 6 symbols

                    // get center column position
                    const winRow = targetStops.current[0].row;
                    const symbol = reels.current[2].symbols[winRow];
                    const pos = symbol.getGlobalPosition();

                    showCoinAt(pos.x, 230);

                    setTimeout(onSpinEnd, 2000);
                }
            }, 1000 + i * 250);
        });
    }

    // ----------------------------
    // SPINNING LOOP
    // ----------------------------
    function tick() {
        reels.current.forEach((reel) => {
            if (!reel.spinning) return;

            reel.symbols.forEach((sym) => {
                sym.y += reel.speed;

                if (sym.y > ROWS * SYMBOL) {
                    sym.y -= (ROWS + 2) * SYMBOL;

                    const tex = symbolsTextures.current[
                        Math.floor(Math.random() * symbolsTextures.current.length)
                        ];
                    sym.texture = tex;
                }
            });
        });
    }

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none"
            }}
        />
    );
}
