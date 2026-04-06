import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";

// Enhanced Balloon-Train Game with improved visuals and gameplay

const QA = [
  { q: "Popular Sovereignty", a: "Power comes from the people" },
  { q: "Federalism", a: "Power shared between Centre & States" },
  { q: "Judicial Review", a: "Courts can overturn unconstitutional laws" },
  { q: "Separation of Powers", a: "Government split into 3 branches" },
  { q: "Checks & Balances", a: "Each branch limits the others" },
  { q: "Individual Rights", a: "Constitution protects liberties" },
  { q: "Limited Government", a: "Government power is restricted by law" },
  { q: "Secularism", a: "State treats all religions equally" },
  { q: "Preamble", a: "Introduction to the Constitution" },
  { q: "Fundamental Duties", a: "Moral obligations of citizens" },
];

// Utility: random integer
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Inline simple audio generation (short pop & ding) using WebAudio API
function useSounds() {
  const audioCtxRef = useRef(null);
  useEffect(() => {
    audioCtxRef.current = null; // lazy init
  }, []);

  const pop = () => {
    const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(800, ctx.currentTime);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.13);
  };

  const ding = () => {
    const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(600, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.6);
  };

  return { pop, ding };
}

// CSS as JS object — Enhanced visuals
const styles = {
  app: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #FFF8DC 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hud: {
    width: "100%",
    maxWidth: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "0 0 16px 16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  gameArea: {
    position: "relative",
    width: "100%",
    maxWidth: 1000,
    height: 560,
    background: "linear-gradient(180deg, #B0E2FF 0%, #E0F6FF 40%, #FFF8DC 100%)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    margin: "20px 0",
  },
  ground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    background: "linear-gradient(180deg, #8B7355 0%, #654321 100%)",
    borderTop: "4px solid #5C4033",
  },
  track: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    height: 8,
    background: "repeating-linear-gradient(90deg, #444 0px, #444 8px, #ddd 8px, #ddd 16px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
};

export default function TrainBalloon() {
  const navigate = useNavigate();
  const [balloons, setBalloons] = useState([]); // {id, text, answer, x, y, speed}
  const [crates, setCrates] = useState([]); // {id, answer, x, y, vy, targetIndex, match}
  const [trainCompartments, setTrainCompartments] = useState([]); // {index, q, x}
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [spawnIntervalMs, setSpawnIntervalMs] = useState(1400);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [showFeedback, setShowFeedback] = useState(null); // {text, color, id}
  const gameRef = useRef(null);
  const balloonId = useRef(1);
  const crateId = useRef(1);
  const comboTimerRef = useRef(null);
  const { pop, ding } = useSounds();
  const gravity = 0.6;

  // initialize train compartments
  useEffect(() => {
    const comps = Array.from({ length: 5 }).map((_, i) => ({
      index: i,
      q: QA[(i) % QA.length].q,
      x: 120 + i * 152, // position relative to game area
    }));
    setTrainCompartments(comps);
  }, []);

  // game loop: balloons move left-to-right (balloons fly opposite to train movement: right->left)
  useEffect(() => {
    if (!running) return;
    let rafId;
    let last = performance.now();

    const loop = (t) => {
      const dt = Math.min(40, t - last) / 16.67; // normalized delta
      last = t;

      // move balloons
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, x: b.x - b.speed * dt }))
          .filter((b) => b.x > -120)
      );

      // move crates (physics)
      setCrates((prev) =>
        prev
          .map((c) => {
            const newVy = c.vy + gravity * dt;
            const newY = c.y + newVy * dt * 6;
            return { ...c, vy: newVy, y: newY };
          })
          .filter((c) => c.y < 480) // remove crates that fell beyond ground visually
      );

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [running]);

  // spawn balloons on interval
  useEffect(() => {
    if (!running) return;
    const spawner = setInterval(() => {
      const answers = QA.map((x) => x.a);
      const ans = answers[rnd(0, answers.length - 1)];
      const b = {
        id: balloonId.current++,
        text: ans,
        x: 980,
        y: rnd(40, 220),
        speed: rnd(2, 4) + Math.random() * 1.6,
      };
      setBalloons((p) => [...p, b]);
    }, spawnIntervalMs);
    return () => clearInterval(spawner);
  }, [running, spawnIntervalMs]);

  // countdown
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // increase difficulty over time (reduce spawn interval) and level up
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setSpawnIntervalMs((s) => Math.max(550, Math.floor(s * 0.92)));
      setLevel((l) => l + 1);
    }, 15000); // level up every 15 seconds
    return () => clearInterval(iv);
  }, [running]);

  // reset combo after 3 seconds of inactivity
  useEffect(() => {
    if (combo > 0) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setCombo(0);
      }, 3000);
    }
    return () => clearTimeout(comboTimerRef.current);
  }, [combo]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setBalloons([]);
    setCrates([]);
    setSpawnIntervalMs(1400);
    setCombo(0);
    setLives(3);
    setLevel(1);
    setShowFeedback(null);
    balloonId.current = 1;
    crateId.current = 1;
    setRunning(true);
  };

  // handle popping balloon
  const handlePop = (id) => {
    const b = balloons.find((x) => x.id === id);
    if (!b) return;
    pop();
    // spawn crate at balloon x,y
    // choose a target compartment based on player's aim: we will drop crate vertically above the compartment nearest to pointer x at pop time
    const gameRect = gameRef.current.getBoundingClientRect();
    const comps = trainCompartments;

    // find which compartment is closest horizontally to current balloon center (simulate physics drop)
    // Convert balloon absolute x to relative to game area: b.x is already relative to game area width (approx), so we can compute index by finding comp.x nearest to b.x
    let targetIndex = 0;
    let minD = 1e9;
    comps.forEach((c) => {
      const d = Math.abs(c.x - b.x);
      if (d < minD) {
        minD = d;
        targetIndex = c.index;
      }
    });

    // create crate
    const c = {
      id: crateId.current++,
      answer: b.text,
      x: b.x - 18,
      y: b.y,
      vy: 0,
      targetIndex,
      match: null,
    };

    setCrates((p) => [...p, c]);

    // remove balloon immediately (pop)
    setBalloons((p) => p.filter((x) => x.id !== id));

    // after a short delay, evaluate if crate answer matches compartment question
    setTimeout(() => {
      const comp = trainCompartments[targetIndex];
      const correctAnswer = QA.find((z) => z.q === comp.q).a;
      const isMatch = correctAnswer === b.text;
      
      if (isMatch) {
        // Correct match: increase combo and award points with combo multiplier
        setCombo((c) => c + 1);
        const comboMultiplier = Math.min(1 + combo * 0.2, 3); // max 3x multiplier
        const points = Math.floor(10 * comboMultiplier);
        setScore((s) => s + points);
        ding();
        
        // Show feedback
        setShowFeedback({ 
          text: combo > 0 ? `+${points} (${combo + 1}x Combo!)` : `+${points}`, 
          color: '#22c55e', 
          id: Date.now() 
        });
        
        // Confetti effect
        explodeConfettiAt(c.x + 40, c.y + 80);
      } else {
        // Wrong match: lose life and reset combo
        setCombo(0);
        setLives((l) => Math.max(0, l - 1));
        setScore((s) => Math.max(0, s - 5));
        
        // Show feedback
        setShowFeedback({ 
          text: '-5 (Wrong!)', 
          color: '#ef4444', 
          id: Date.now() 
        });
        
        // Check game over
        if (lives <= 1) {
          setRunning(false);
        }
      }
      
      // set match flag on crate for visual
      setCrates((prev) => prev.map((p) => (p.id === c.id ? { ...p, match: isMatch } : p)));

      // remove crate after 1.8s
      setTimeout(() => {
        setCrates((prev) => prev.filter((pc) => pc.id !== c.id));
      }, 1800);
    }, 1100);
  };

  // small confetti — create colorful divs absolutely positioned then remove
  const explodeConfettiAt = (x, y) => {
    const area = gameRef.current;
    if (!area) return;
    const colors = ["#ff5e6c", "#ffd166", "#06d6a0", "#4d96ff"];
    const nodes = [];
    for (let i = 0; i < 12; i++) {
      const d = document.createElement("div");
      d.style.position = "absolute";
      d.style.left = x + Math.random() * 40 - 20 + "px";
      d.style.top = y + Math.random() * 40 - 20 + "px";
      d.style.width = "8px";
      d.style.height = "12px";
      d.style.background = colors[Math.floor(Math.random() * colors.length)];
      d.style.borderRadius = "2px";
      d.style.opacity = "0.95";
      d.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
      d.style.zIndex = 9999;
      area.appendChild(d);
      nodes.push(d);
      const tx = (Math.random() - 0.5) * 220;
      const ty = -Math.random() * 160 - 20;
      d.animate(
        [
          { transform: `translate(0px,0px) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${tx}px,${ty}px) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    }
    setTimeout(() => nodes.forEach((n) => n.remove()), 1600);
  };

  return (
    <div style={styles.app}>
      <button
        className="flex gap-1 items-center text-xl "
        type="button"
        onClick={() => navigate('/games')}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 10001,
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          fontWeight: 700,
          padding: "8px 16px",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
      >
        Exit <span className='text-xl text-red-500 font-bold'><RxExit /></span>
      </button>
      <div style={styles.hud}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => (running ? setRunning(false) : startGame())}
            style={{ 
              padding: "10px 16px", 
              borderRadius: 8, 
              border: "none", 
              background: running ? "#ef4444" : "#22c55e", 
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <div style={{ fontSize: 14, color: "#123", fontWeight: 600 }}>
            ⏱ {timeLeft}s
          </div>
          <div style={{ fontSize: 14, color: "#ef4444", fontWeight: 600 }}>
            ❤️ × {lives}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Balloon Train — Civic Quiz</div>
          <div style={{ fontSize: 12, color: "#444" }}>Pop the balloon to drop the crate onto the matching compartment</div>
          {combo > 0 && (
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>
              🔥 {combo}x COMBO!
            </div>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#123" }}>Score: {score}</div>
          <div style={{ fontSize: 12, color: "#666" }}>Level: {level}</div>
        </div>
      </div>

      <div style={styles.gameArea} ref={gameRef}>
        {/* Feedback overlay */}
        {showFeedback && (
          <div
            key={showFeedback.id}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 48,
              fontWeight: 900,
              color: showFeedback.color,
              textShadow: "0 0 20px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.3)",
              zIndex: 9999,
              pointerEvents: "none",
              animation: "feedbackPop 1s ease-out forwards",
            }}
            onAnimationEnd={() => setShowFeedback(null)}
          >
            {showFeedback.text}
          </div>
        )}
        
        {/* Game Over overlay */}
        {!running && (lives === 0 || timeLeft === 0) && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
          >
            <div style={{ color: "white", fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
              {timeLeft === 0 ? "Time's Up!" : "Game Over!"}
            </div>
            <div style={{ color: "white", fontSize: 24, marginBottom: 32 }}>
              Final Score: {score}
            </div>
            <button
              onClick={startGame}
              style={{
                padding: "12px 24px",
                fontSize: 18,
                borderRadius: 12,
                border: "none",
                background: "#22c55e",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Play Again
            </button>
          </div>
        )}
        
        {/* sky elements: clouds */}
        <Clouds />

        {/* balloons */}
        {balloons.map((b) => (
          <div
            key={b.id}
            onClick={() => handlePop(b.id)}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: 110,
              height: 90,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              zIndex: 60,
            }}
          >
            <div style={{ transform: "translateY(-8px)" }}>
              <Balloon label={b.text} />
            </div>
          </div>
        ))}

        {/* crates */}
        {crates.map((c) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: 64,
              height: 46,
              zIndex: 80,
              transform: `translateY(0px)`,
              transition: "transform 0.08s linear",
            }}
          >
            <Crate match={c.match} />
          </div>
        ))}

        {/* Enhanced train with locomotive and carriages */}
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, height: 160 }}>
          {/* Locomotive (engine at front) */}
          <div style={{ position: "absolute", left: 12, bottom: 12, width: 80, height: 110 }}>
            {/* Smokestack */}
            <div style={{ 
              position: "absolute", 
              left: 18, 
              top: -8, 
              width: 16, 
              height: 24, 
              background: "linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%)",
              borderRadius: "8px 8px 0 0",
              border: "2px solid #1a1a1a"
            }}>
              {/* Smoke puffs */}
              <div style={{ 
                position: "absolute", 
                top: -12, 
                left: "50%", 
                transform: "translateX(-50%)",
                width: 20,
                height: 20,
                background: "rgba(200, 200, 200, 0.6)",
                borderRadius: "50%",
                animation: "smoke 2s ease-in-out infinite"
              }} />
            </div>
            
            {/* Main engine body */}
            <div style={{ 
              width: "100%", 
              height: 80, 
              background: "linear-gradient(135deg, #c41e3a 0%, #8b0000 100%)",
              borderRadius: "12px 12px 4px 4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
              border: "3px solid #7a1818",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Engine window */}
              <div style={{ 
                position: "absolute", 
                top: 12, 
                left: 12, 
                width: 36, 
                height: 32,
                background: "linear-gradient(135deg, #87CEEB 0%, #4a90a4 100%)",
                borderRadius: 6,
                border: "2px solid #2c5f6f",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
              }} />
              
              {/* Engine details - rivets */}
              <div style={{ position: "absolute", top: 52, left: 8, display: "flex", gap: 8 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: "50%", 
                    background: "#5a1010",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)"
                  }} />
                ))}
              </div>
              
              {/* Headlight */}
              <div style={{ 
                position: "absolute", 
                bottom: 8, 
                right: 8, 
                width: 16, 
                height: 16,
                borderRadius: "50%",
                background: "radial-gradient(circle, #fff9a8 0%, #ffd700 100%)",
                boxShadow: "0 0 12px rgba(255, 215, 0, 0.8), inset 0 1px 2px rgba(255,255,255,0.6)",
                border: "2px solid #b8860b"
              }} />
            </div>
            
            {/* Front cowcatcher */}
            <div style={{
              position: "absolute",
              bottom: 4,
              right: -12,
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderBottom: "16px solid #444",
              borderTop: "0px solid transparent"
            }} />
            
            {/* Engine wheels */}
            <div style={{ position: "absolute", bottom: -14, left: 8, display: "flex", gap: 20 }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: "50%", 
                  background: "radial-gradient(circle, #1a1a1a 0%, #000 70%)",
                  border: "4px solid #333",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
                  position: "relative"
                }}>
                  {/* Wheel spokes */}
                  <div style={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    width: "60%", 
                    height: 2, 
                    background: "#666",
                    transform: "translate(-50%, -50%)"
                  }} />
                  <div style={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    width: 2, 
                    height: "60%", 
                    background: "#666",
                    transform: "translate(-50%, -50%)"
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Train compartments (carriages) */}
          <div style={{ position: "absolute", left: 108, top: 16, right: 0, height: 120 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 120, display: "flex", gap: 8 }}>
              {trainCompartments.map((c, idx) => (
                <div
                  key={c.index}
                  style={{
                    width: 140,
                    height: 100,
                    background: `linear-gradient(135deg, ${
                      idx % 2 === 0 ? "#4a90a4 0%, #2c5f6f 100%" : "#5a7d3a 0%, #3d5928 100%"
                    })`,
                    borderRadius: "8px 8px 4px 4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15)",
                    border: "3px solid rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: 8,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Window/panel background */}
                  <div style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    right: 8,
                    bottom: 8,
                    background: "rgba(247, 243, 238, 0.95)",
                    borderRadius: 6,
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                    border: "2px solid rgba(0,0,0,0.1)"
                  }} />
                  
                  {/* Content */}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#1a1a1a" }}>
                      {c.q}
                    </div>
                    <div style={{ fontSize: 11, color: "#666" }}>Drop correct crate</div>
                  </div>
                  
                  {/* Carriage connection */}
                  {idx < trainCompartments.length - 1 && (
                    <div style={{
                      position: "absolute",
                      right: -8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 8,
                      height: 12,
                      background: "#2c2c2c",
                      borderRadius: "0 4px 4px 0",
                      zIndex: 2
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Carriage wheels */}
          <div style={{ position: "absolute", left: 124, bottom: -2, display: "flex", gap: 55 }}>
            {trainCompartments.map((_, idx) => (
              <div key={idx} style={{ display: "flex", gap: 12 }}>
                {[...Array(2)].map((_, wheelIdx) => (
                  <div key={wheelIdx} style={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: "50%", 
                    background: "radial-gradient(circle, #1a1a1a 0%, #000 70%)",
                    border: "3px solid #333",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.1)",
                    position: "relative"
                  }}>
                    {/* Wheel center hub */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#666",
                      boxShadow: "0 0 4px rgba(255,255,255,0.3)"
                    }} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Connecting rod between wheels */}
          <div style={{ 
            position: "absolute", 
            left: 20, 
            bottom: 6, 
            width: 40, 
            height: 4, 
            background: "#444",
            borderRadius: 2
          }} />
        </div>

        <div style={styles.ground} />
        <div style={styles.track} />
      </div>

      <div style={{ marginTop: 12, maxWidth: 1000, width: "100%", padding: "0 24px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              // shuffle compartments questions
              setTrainCompartments((prev) => prev.map((p, i) => ({ ...p, q: QA[(i + rnd(1, QA.length - 1)) % QA.length].q })));
            }}
            style={{ 
              padding: "8px 16px", 
              borderRadius: 8, 
              border: "none", 
              background: "#3b82f6", 
              color: "white",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            🔀 Shuffle Questions
          </button>

          <div style={{ fontSize: 13, color: "#444", flex: 1 }}>
            💡 <strong>Tips:</strong> Pop balloons above the right compartment • Build combos for bonus points • Watch your lives!
          </div>
        </div>
      </div>
      
      {/* CSS animations */}
      <style>{`
        @keyframes feedbackPop {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -80%) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes smoke {
          0% {
            transform: translate(-50%, 0) scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -20px) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -40px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function Balloon({ label }) {
  return (
    <div style={{ position: "relative", width: 110, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="110" height="90" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="54" cy="36" rx="36" ry="30" fill="#ff9aa2" />
        <path d="M46 58c0-6 16-6 16 0v6H46v-6z" fill="#7a4" opacity="0.06" />
        <rect x="50" y="60" width="8" height="18" rx="2" fill="#8b5a3c" />
        <path d="M54 72v12" stroke="#6b4328" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", width: 84, textAlign: "center", fontSize: 11, fontWeight: 600, color: "#2b2730", padding: "6px 4px" }}>{label}</div>
    </div>
  );
}

function Crate({ match }) {
  return (
    <div style={{ width: 64, height: 46, position: "relative" }}>
      <div style={{ width: "100%", height: "100%", background: match === null ? "#b88654" : match ? "#6bd36b" : "#d35b5b", borderRadius: 6, boxShadow: "0 6px 12px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
        {match === null ? "" : match ? "✔" : "✖"}
      </div>
      <div style={{ position: "absolute", left: 8, bottom: -8, width: 48, height: 8, background: "#6b4328", borderRadius: 4 }} />
    </div>
  );
}

function Clouds() {
  return (
    <div>
      <svg style={{ position: "absolute", left: 30, top: 8, opacity: 0.9 }} width="160" height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="36" cy="28" rx="28" ry="18" fill="#fff" />
        <ellipse cx="80" cy="30" rx="34" ry="20" fill="#fff" />
      </svg>
      <svg style={{ position: "absolute", right: 40, top: 40, opacity: 0.8 }} width="120" height="44" viewBox="0 0 120 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="28" cy="22" rx="22" ry="14" fill="#fff" />
        <ellipse cx="68" cy="24" rx="26" ry="16" fill="#fff" />
      </svg>
    </div>
  );
}
