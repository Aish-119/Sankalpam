import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0d14",
  surface: "#111520",
  surfaceElevated: "#161c2e",
  border: "#1e2840",
  borderLight: "#263050",
  accent: "#4f8ef7",
  accentSoft: "#3b6fd4",
  lavender: "#a78bfa",
  lavenderSoft: "#7c5cbf",
  success: "#34d399",
  successDim: "#1a6b4a",
  warning: "#fbbf24",
  danger: "#f87171",
  textPrimary: "#e8eaf2",
  textSecondary: "#8892aa",
  textMuted: "#4a5570",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const SKILLS = [
  { id: "coding", icon: "⌨️", label: "Coding" },
  { id: "fitness", icon: "🏋️", label: "Fitness" },
  { id: "reading", icon: "📚", label: "Reading" },
  { id: "meditation", icon: "🧘", label: "Meditation" },
  { id: "language", icon: "🗣️", label: "Language" },
  { id: "finance", icon: "📈", label: "Finance" },
  { id: "podcast", icon: "🎧", label: "Podcasts" },
  { id: "writing", icon: "✍️", label: "Writing" },
];

const LIFE_AREAS = [
  { id: "learning", icon: "🧠", label: "Learning", color: "#4f8ef7" },
  { id: "health", icon: "💚", label: "Health", color: "#34d399" },
  { id: "career", icon: "🚀", label: "Career", color: "#a78bfa" },
  { id: "finance", icon: "💰", label: "Finance", color: "#fbbf24" },
  { id: "mindfulness", icon: "🌸", label: "Mindfulness", color: "#f472b6" },
];

const MOCK_HABITS = [
  { id: 1, name: "Morning Meditation", icon: "🧘", area: "mindfulness", timeGoal: 20, timeSpent: 1340, streak: 14, completed: true, paused: false, frequency: "daily", history: generateHistory(14, 0.85) },
  { id: 2, name: "Coding Practice", icon: "⌨️", area: "career", timeGoal: 90, timeSpent: 5420, streak: 21, completed: true, paused: false, frequency: "daily", history: generateHistory(21, 0.9) },
  { id: 3, name: "Reading", icon: "📚", area: "learning", timeGoal: 30, timeSpent: 2100, streak: 7, completed: false, paused: false, frequency: "daily", history: generateHistory(7, 0.75) },
  { id: 4, name: "Gym Workout", icon: "🏋️", area: "health", timeGoal: 60, timeSpent: 3600, streak: 5, completed: false, paused: false, frequency: "daily", history: generateHistory(5, 0.8) },
  { id: 5, name: "Language Learning", icon: "🗣️", area: "learning", timeGoal: 25, timeSpent: 900, streak: 3, completed: false, paused: true, frequency: "daily", history: generateHistory(3, 0.6) },
];

function generateHistory(streak, rate) {
  const h = {};
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (i < streak) h[key] = "done";
    else if (i < streak + 30) h[key] = Math.random() < rate ? "done" : Math.random() < 0.3 ? "partial" : "missed";
    else h[key] = Math.random() < rate * 0.7 ? "done" : "missed";
  }
  return h;
}

const MOCK_USER = {
  name: "Arjun Sharma",
  email: "arjun@example.com",
  avatar: null,
  status: "student",
  goals: ["coding", "fitness", "meditation"],
  sankalpPoints: 85,
  totalStreak: 21,
  longestStreak: 34,
  weekScore: 87,
};

const WEEKLY_DATA = [
  { day: "Mon", coding: 90, fitness: 60, meditation: 20, reading: 30 },
  { day: "Tue", coding: 120, fitness: 0, meditation: 20, reading: 45 },
  { day: "Wed", coding: 60, fitness: 60, meditation: 15, reading: 20 },
  { day: "Thu", coding: 150, fitness: 60, meditation: 20, reading: 30 },
  { day: "Fri", coding: 90, fitness: 0, meditation: 20, reading: 60 },
  { day: "Sat", coding: 30, fitness: 90, meditation: 25, reading: 45 },
  { day: "Sun", coding: 60, fitness: 60, meditation: 30, reading: 0 },
];

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Syne:wght@400;500;600;700;800&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: ${COLORS.bg};
    color: ${COLORS.textPrimary};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  
  .syne { font-family: 'Syne', sans-serif; }
  
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
  
  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.lavender});
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79,142,247,0.3); }
  .btn-primary:active { transform: translateY(0); }
  
  .btn-secondary {
    background: ${COLORS.surfaceElevated};
    color: ${COLORS.textSecondary};
    border: 1px solid ${COLORS.border};
    padding: 10px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: ${COLORS.borderLight}; color: ${COLORS.textPrimary}; }
  
  .card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    padding: 24px;
  }
  .card:hover { border-color: ${COLORS.borderLight}; }
  
  input, select, textarea {
    background: ${COLORS.surfaceElevated};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    color: ${COLORS.textPrimary};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 12px 16px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 0 3px rgba(79,142,247,0.12);
  }
  input::placeholder { color: ${COLORS.textMuted}; }
  
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${COLORS.surfaceElevated};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 13px;
    color: ${COLORS.textSecondary};
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .tag.active {
    background: rgba(79,142,247,0.12);
    border-color: rgba(79,142,247,0.4);
    color: ${COLORS.accent};
  }
  .tag:hover:not(.active) { border-color: ${COLORS.borderLight}; color: ${COLORS.textPrimary}; }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 11px;
    color: ${COLORS.textMuted};
    border: 1px solid transparent;
  }
  .nav-item.active {
    background: rgba(79,142,247,0.1);
    border-color: rgba(79,142,247,0.2);
    color: ${COLORS.accent};
  }
  .nav-item:hover:not(.active) { color: ${COLORS.textSecondary}; }
  
  .streak-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(248,113,113,0.1));
    border: 1px solid rgba(251,191,36,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 500;
    color: ${COLORS.warning};
  }
  
  .progress-bar {
    height: 4px;
    background: ${COLORS.border};
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.lavender});
    transition: width 0.6s ease;
  }
  
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.borderLight};
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
    animation: fadeUp 0.3s ease;
  }
  
  .ai-typing::after {
    content: '▋';
    animation: pulse-ring 0.8s infinite;
  }
`;

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
function fmtMins(m) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60 > 0 ? (m % 60) + "m" : ""}`.trim();
}

function getDateKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split("T")[0];
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function Avatar({ user, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.lavender})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 600, flexShrink: 0,
      color: "white", fontFamily: "Syne, sans-serif",
    }}>
      {user.name.charAt(0)}
    </div>
  );
}

function CircularProgress({ value, size = 80, stroke = 6, color = COLORS.accent, label, sublabel }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        {label && <div style={{ fontSize: size * 0.22, fontWeight: 700, fontFamily: "Syne, sans-serif", color: COLORS.textPrimary }}>{label}</div>}
        {sublabel && <div style={{ fontSize: size * 0.14, color: COLORS.textMuted }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function BarChart({ data, keys, colors }) {
  const max = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k] || 0), 0)));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
      {data.map((d, i) => {
        const total = keys.reduce((s, k) => s + (d[k] || 0), 0);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column-reverse", gap: 1, height: 96, justifyContent: "flex-start" }}>
              {keys.map((k, ki) => {
                const h = max > 0 ? ((d[k] || 0) / max) * 96 : 0;
                return h > 0 ? (
                  <div key={k} style={{
                    height: h, background: colors[ki], borderRadius: ki === keys.length - 1 ? "4px 4px 0 0" : 0,
                    opacity: 0.85, transition: "height 0.5s ease"
                  }} />
                ) : null;
              })}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

function HeatmapCell({ status }) {
  const bg = status === "done" ? COLORS.success : status === "partial" ? COLORS.warning : status === "missed" ? "rgba(248,113,113,0.3)" : COLORS.border;
  return <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, flexShrink: 0 }} />;
}

function HabitHeatmap({ history }) {
  const today = new Date();
  const cells = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    cells.push(history[key]);
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {cells.map((s, i) => <HeatmapCell key={i} status={s} />)}
    </div>
  );
}

function GrowthWheel({ areas }) {
  const size = 200;
  const cx = size / 2, cy = size / 2;
  const maxR = 80;
  const values = [78, 65, 82, 45, 71];
  const n = areas.length;
  const points = areas.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const r = (values[i] / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const polygon = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg width={size} height={size}>
        {[25, 50, 75, 100].map(pct => {
          const r2 = (pct / 100) * maxR;
          const gridPoints = areas.map((_, i) => {
            const angle = (2 * Math.PI * i) / n - Math.PI / 2;
            return `${cx + r2 * Math.cos(angle)},${cy + r2 * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={pct} points={gridPoints} fill="none" stroke={COLORS.border} strokeWidth={1} />;
        })}
        {areas.map((_, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)} stroke={COLORS.border} strokeWidth={1} />;
        })}
        <polygon points={polygon} fill="rgba(79,142,247,0.15)" stroke={COLORS.accent} strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={areas[i].color} />
        ))}
        {areas.map((a, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const labelR = maxR + 20;
          return (
            <text key={i} x={cx + labelR * Math.cos(angle)} y={cy + labelR * Math.sin(angle)}
              textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={COLORS.textSecondary}>
              {a.icon}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function Timer({ onClose }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState("focus");
  const interval = useRef(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setSeconds(s => {
        if (s <= 1) { setRunning(false); setSession(prev => prev === "focus" ? "break" : "focus"); return prev === "focus" ? 5 * 60 : 25 * 60; }
        return s - 1;
      }), 1000);
    } else clearInterval(interval.current);
    return () => clearInterval(interval.current);
  }, [running]);

  const pct = session === "focus" ? (1 - seconds / (25 * 60)) * 100 : (1 - seconds / (5 * 60)) * 100;
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: "center", maxWidth: 360 }}>
        <h2 className="syne" style={{ fontSize: 20, marginBottom: 8 }}>🎯 Focus Mode</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 32 }}>
          {session === "focus" ? "Deep work session" : "Take a break"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <CircularProgress value={pct} size={160} stroke={8}
            color={session === "focus" ? COLORS.accent : COLORS.success}
            label={`${mins}:${secs}`} sublabel={session} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => setRunning(r => !r)}>
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button className="btn-secondary" onClick={() => { setSeconds(25 * 60); setRunning(false); setSession("focus"); }}>
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function AddHabitModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", icon: "⭐", area: "learning", timeGoal: 30, frequency: "daily" });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="syne" style={{ fontSize: 20, marginBottom: 4 }}>New Habit</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 24 }}>Build a new consistent practice</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>HABIT NAME</label>
            <input placeholder="e.g. Morning journaling" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>ICON</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} style={{ textAlign: "center", fontSize: 20 }} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>LIFE AREA</label>
              <select value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}>
                {LIFE_AREAS.map(a => <option key={a.id} value={a.id}>{a.icon} {a.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>TIME GOAL (min)</label>
              <input type="number" value={form.timeGoal} onChange={e => setForm(f => ({ ...f, timeGoal: +e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>FREQUENCY</label>
              <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={{ flex: 2 }} onClick={() => { if (form.name) { onAdd(form); onClose(); } }}>
              ✦ Add Habit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ─────────────────────────────────────────────────────────────────────

function LandingPage({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,142,247,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="fade-up" style={{ textAlign: "center", maxWidth: 640, zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 32, fontSize: 12, color: COLORS.accent, letterSpacing: "0.1em" }}>
          ✦ YOUR PERSONAL GROWTH OS
        </div>

        <h1 className="syne" style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.02em" }}>
          <span style={{ color: COLORS.textPrimary }}>Commit to your</span>
          <br />
          <span style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.lavender})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Sankalpa
          </span>
        </h1>

        <p style={{ fontSize: 18, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
          Build habits. Track growth. Stay disciplined. Your AI-powered companion for becoming the person you envision.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
          <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={onEnter}>
            Begin your journey →
          </button>
          <button className="btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }}>
            Watch demo
          </button>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "🔥", stat: "21-day", label: "Streak system" },
            { icon: "🧠", stat: "AI-powered", label: "Routine builder" },
            { icon: "📊", stat: "Deep", label: "Analytics" },
            { icon: "🌍", stat: "Social", label: "Accountability" },
          ].map(({ icon, stat, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
              <div className="syne" style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>{stat}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function submit() {
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth({ ...MOCK_USER, name: form.name || MOCK_USER.name }); }, 1200);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.lavender})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sankalpam</div>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>{mode === "login" ? "Welcome back" : "Begin your journey"}</p>
        </div>
        <div className="card">
          <div style={{ display: "flex", marginBottom: 24, background: COLORS.surfaceElevated, borderRadius: 10, padding: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? COLORS.surface : "transparent",
                color: mode === m ? COLORS.textPrimary : COLORS.textMuted,
                fontSize: 14, fontFamily: "DM Sans, sans-serif",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                transition: "all 0.2s",
              }}>{m === "login" ? "Log in" : "Sign up"}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>YOUR NAME</label>
                <input placeholder="Arjun Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>EMAIL</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>PASSWORD</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            {mode === "login" && <div style={{ textAlign: "right", marginTop: -8 }}><span style={{ fontSize: 12, color: COLORS.accent, cursor: "pointer" }}>Forgot password?</span></div>}
            <button className="btn-primary" style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={submit}>
              {loading ? <span style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} /> : null}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoutineBuilderPage({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [schedule, setSchedule] = useState({ wake: "06:00", sleep: "22:30", work: "09:00-17:00", freeTime: "3h" });
  const [selectedSkills, setSelectedSkills] = useState(["coding", "meditation"]);
  const [generating, setGenerating] = useState(false);
  const [routine, setRoutine] = useState(null);

  function toggleSkill(id) {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  function generateRoutine() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setRoutine([
        { time: "06:00", task: "Wake up & hydrate", duration: 10, area: "health" },
        { time: "06:10", task: "Morning meditation", duration: 20, area: "mindfulness" },
        { time: "06:30", task: "Exercise / Yoga", duration: 45, area: "health" },
        { time: "07:15", task: "Healthy breakfast", duration: 25, area: "health" },
        { time: "07:40", task: "Learning / Reading", duration: 40, area: "learning" },
        { time: "09:00", task: "Work / College", duration: 480, area: "career" },
        { time: "13:00", task: "Lunch break", duration: 60, area: "health" },
        { time: "17:00", task: "Coding practice", duration: 90, area: "career" },
        { time: "18:30", task: "Language learning", duration: 30, area: "learning" },
        { time: "19:00", task: "Evening walk", duration: 30, area: "health" },
        { time: "19:30", task: "Personal projects", duration: 90, area: "career" },
        { time: "21:00", task: "Reading / Wind down", duration: 60, area: "mindfulness" },
        { time: "22:00", task: "Reflection & journaling", duration: 20, area: "mindfulness" },
        { time: "22:30", task: "Sleep", duration: 0, area: "health" },
      ]);
      setStep(2);
    }, 2000);
  }

  const areaColors = { health: COLORS.success, mindfulness: "#f472b6", learning: COLORS.accent, career: COLORS.lavender };

  if (step === 0) return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }} className="fade-up">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🧠</div>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Let's build your routine</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Tell me about your daily schedule and I'll create an optimized plan for you.</p>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 20, letterSpacing: "0.08em" }}>DAILY SCHEDULE</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[["wake", "Wake up time"], ["sleep", "Sleep time"]].map(([k, l]) => (
            <div key={k}>
              <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>{l.toUpperCase()}</label>
              <input type="time" value={schedule[k]} onChange={e => setSchedule(s => ({ ...s, [k]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>WORK/COLLEGE HOURS</label>
            <input value={schedule.work} onChange={e => setSchedule(s => ({ ...s, work: e.target.value }))} placeholder="09:00 - 17:00" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>FREE TIME</label>
            <input value={schedule.freeTime} onChange={e => setSchedule(s => ({ ...s, freeTime: e.target.value }))} placeholder="3 hours" />
          </div>
        </div>
      </div>
      <button className="btn-primary" style={{ width: "100%" }} onClick={() => setStep(1)}>
        Next: Choose skills →
      </button>
    </div>
  );

  if (step === 1) return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }} className="fade-up">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Skills to develop</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Choose what you want to build mastery in</p>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {SKILLS.map(s => (
            <span key={s.id} className={`tag ${selectedSkills.includes(s.id) ? "active" : ""}`} onClick={() => toggleSkill(s.id)}>
              {s.icon} {s.label}
            </span>
          ))}
        </div>
      </div>
      {generating ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>AI is analyzing your schedule...</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={generateRoutine}>✦ Generate my routine</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }} className="fade-up">
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 16, fontSize: 12, color: COLORS.success }}>
          ✓ AI Routine Generated
        </div>
        <h1 className="syne" style={{ fontSize: 24, fontWeight: 700 }}>Your Optimized Daily Routine</h1>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {routine.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < routine.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div style={{ width: 48, fontSize: 12, color: COLORS.textMuted, flexShrink: 0 }}>{item.time}</div>
              <div style={{ width: 3, height: item.task === "Sleep" ? 8 : 24, background: areaColors[item.area] || COLORS.accent, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{item.task}</div>
              </div>
              {item.duration > 0 && <div style={{ fontSize: 12, color: COLORS.textMuted }}>{fmtMins(item.duration)}</div>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-secondary" onClick={() => { setStep(1); setRoutine(null); }}>↺ Regenerate</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={onComplete}>Accept routine →</button>
      </div>
    </div>
  );
}

function DashboardPage({ user, habits, setHabits }) {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const today = getDateKey();
  const completedToday = habits.filter(h => h.completed).length;
  const completion = Math.round((completedToday / habits.length) * 100);

  function toggleComplete(id) {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  }

  function addHabit(form) {
    const newH = {
      id: Date.now(), name: form.name, icon: form.icon, area: form.area,
      timeGoal: form.timeGoal, timeSpent: 0, streak: 0, completed: false,
      paused: false, frequency: form.frequency, history: {},
    };
    setHabits(prev => [...prev, newH]);
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 700, margin: "0 auto" }}>
      {showTimer && <Timer onClose={() => setShowTimer(false)} />}
      {showAddHabit && <AddHabitModal onClose={() => setShowAddHabit(false)} onAdd={addHabit} />}

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <h1 className="syne" style={{ fontSize: 22, fontWeight: 700 }}>
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user.name.split(" ")[0]} 👋
            </h1>
            <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowTimer(true)}>
              🎯 Focus
            </button>
            <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAddHabit(true)}>
              + Add habit
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 24, animationDelay: "0.1s" }}>
        {[
          { label: "Today's Progress", value: `${completedToday}/${habits.filter(h => !h.paused).length}`, sub: "habits done", icon: "✅", color: COLORS.success },
          { label: "Current Streak", value: `${user.totalStreak}d`, sub: "on fire!", icon: "🔥", color: COLORS.warning },
          { label: "Sankalp Points", value: user.sankalpPoints, sub: "points earned", icon: "⭐", color: COLORS.lavender },
          { label: "Week Score", value: `${user.weekScore}`, sub: "sankalp score", icon: "📊", color: COLORS.accent },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
            <div className="syne" style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.15s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: COLORS.textSecondary }}>Today's completion</span>
          <span className="syne" style={{ fontSize: 14, fontWeight: 600, color: completion >= 80 ? COLORS.success : COLORS.accent }}>{completion}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
      </div>

      {/* Habits list */}
      <div className="fade-up" style={{ animationDelay: "0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 className="syne" style={{ fontSize: 16, fontWeight: 600 }}>Today's Habits</h2>
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date().toLocaleDateString("en-IN", { weekday: "long" })}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {habits.map(habit => {
            const area = LIFE_AREAS.find(a => a.id === habit.area);
            return (
              <div key={habit.id} className="card" style={{
                padding: "16px 20px", opacity: habit.paused ? 0.5 : 1,
                background: habit.completed ? "rgba(52,211,153,0.05)" : COLORS.surface,
                borderColor: habit.completed ? "rgba(52,211,153,0.2)" : COLORS.border,
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => toggleComplete(habit.id)} style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: habit.completed ? COLORS.success : "transparent",
                    border: `2px solid ${habit.completed ? COLORS.success : COLORS.border}`,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: 14, transition: "all 0.2s", flexShrink: 0,
                  }}>
                    {habit.completed ? "✓" : ""}
                  </button>
                  <div style={{ fontSize: 20 }}>{habit.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, textDecoration: habit.completed ? "line-through" : "none", color: habit.completed ? COLORS.textMuted : COLORS.textPrimary }}>
                      {habit.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      {area && <span style={{ fontSize: 11, color: area.color, background: `${area.color}18`, borderRadius: 4, padding: "2px 7px" }}>{area.label}</span>}
                      <span style={{ fontSize: 11, color: COLORS.textMuted }}>Goal: {fmtMins(habit.timeGoal)}</span>
                      {habit.streak > 0 && <span style={{ fontSize: 11, color: COLORS.warning }}>🔥 {habit.streak}d</span>}
                    </div>
                  </div>
                  {habit.paused && <span style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.surfaceElevated, borderRadius: 6, padding: "3px 8px" }}>Paused</span>}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{fmtMins(Math.round(habit.timeSpent / 60))}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted }}>spent</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CalendarPage({ habits }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const today = new Date();

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getDayStatus(day) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const statuses = habits.map(h => h.history[key]).filter(Boolean);
    if (!statuses.length) return null;
    const done = statuses.filter(s => s === "done").length;
    const rate = done / statuses.length;
    if (rate >= 0.8) return "done";
    if (rate >= 0.4) return "partial";
    return "missed";
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 700, margin: "0 auto" }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Calendar</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Your habit history at a glance</p>
      </div>

      <div className="card fade-up" style={{ marginBottom: 20, animationDelay: "0.1s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <button className="btn-secondary" style={{ padding: "8px 16px" }} onClick={() => setSelectedMonth(new Date(year, month - 1))}>←</button>
          <span className="syne" style={{ fontWeight: 600 }}>{selectedMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
          <button className="btn-secondary" style={{ padding: "8px 16px" }} onClick={() => setSelectedMonth(new Date(year, month + 1))}>→</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const status = getDayStatus(day);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const bg = status === "done" ? COLORS.successDim : status === "partial" ? "rgba(251,191,36,0.2)" : status === "missed" ? "rgba(248,113,113,0.15)" : COLORS.surfaceElevated;
            const border = isToday ? COLORS.accent : "transparent";
            return (
              <div key={day} style={{
                aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, background: bg, border: `2px solid ${border}`,
                fontSize: 13, color: isToday ? COLORS.accent : status ? COLORS.textPrimary : COLORS.textMuted,
                fontWeight: isToday ? 600 : 400, cursor: "pointer", transition: "all 0.15s",
              }}>
                {day}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 20, justifyContent: "center" }}>
          {[["done", COLORS.successDim, COLORS.success, "Complete"], ["partial", "rgba(251,191,36,0.2)", COLORS.warning, "Partial"], ["missed", "rgba(248,113,113,0.15)", COLORS.danger, "Missed"]].map(([k, bg, color, label]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${color}` }} />
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>90-Day Heatmap</h3>
        {habits.slice(0, 3).map(h => (
          <div key={h.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{h.icon}</span>
              <span style={{ fontSize: 13 }}>{h.name}</span>
              <span className="streak-badge" style={{ marginLeft: "auto", fontSize: 11 }}>🔥 {h.streak}d</span>
            </div>
            <HabitHeatmap history={h.history} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage({ user }) {
  const totalTime = { coding: 5420, meditation: 1340, reading: 2100, fitness: 3600 };
  const totalMins = Object.values(totalTime).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: "24px 20px", maxWidth: 700, margin: "0 auto" }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Your growth story in numbers</p>
      </div>

      {/* Sankalp Score */}
      <div className="card fade-up" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(79,142,247,0.08), rgba(167,139,250,0.08))", animationDelay: "0.05s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <CircularProgress value={user.weekScore} size={100} stroke={7} color={COLORS.accent} label={user.weekScore} sublabel="score" />
          <div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: "0.08em", marginBottom: 4 }}>WEEKLY SANKALP SCORE</div>
            <div className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {user.weekScore >= 90 ? "🏆 Extraordinary" : user.weekScore >= 75 ? "⚡ Excellent" : user.weekScore >= 60 ? "💪 Good progress" : "🌱 Keep going"}
            </div>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5 }}>
              {user.weekScore >= 75 ? "Excellent discipline this week. Your consistency is building momentum." : "You're making progress. Focus on maintaining daily habits."}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.1s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Weekly Activity</h3>
        <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 20 }}>Minutes per skill this week</p>
        <BarChart data={WEEKLY_DATA} keys={["coding", "fitness", "meditation", "reading"]}
          colors={[COLORS.accent, COLORS.success, "#f472b6", COLORS.lavender]} />
        <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
          {[["Coding", COLORS.accent], ["Fitness", COLORS.success], ["Meditation", "#f472b6"], ["Reading", COLORS.lavender]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time distribution */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.15s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Time Distribution (This Month)</h3>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto" }}>
            <svg width={120} height={120} viewBox="-60 -60 120 120">
              {(() => {
                const items = [
                  { key: "coding", label: "Coding", color: COLORS.accent, val: totalTime.coding },
                  { key: "fitness", label: "Fitness", color: COLORS.success, val: totalTime.fitness },
                  { key: "reading", label: "Reading", color: COLORS.lavender, val: totalTime.reading },
                  { key: "meditation", label: "Meditation", color: "#f472b6", val: totalTime.meditation },
                ];
                let angle = -Math.PI / 2;
                return items.map(item => {
                  const slice = (item.val / totalMins) * 2 * Math.PI;
                  const x1 = 50 * Math.cos(angle), y1 = 50 * Math.sin(angle);
                  angle += slice;
                  const x2 = 50 * Math.cos(angle), y2 = 50 * Math.sin(angle);
                  const large = slice > Math.PI ? 1 : 0;
                  return <path key={item.key} d={`M 0 0 L ${x1} ${y1} A 50 50 0 ${large} 1 ${x2} ${y2} Z`} fill={item.color} opacity={0.8} />;
                });
              })()}
              <circle r={28} fill={COLORS.surface} />
              <text textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={COLORS.textMuted}>
                {fmtMins(Math.round(totalMins / 60))}
              </text>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            {[
              { label: "Coding", color: COLORS.accent, mins: totalTime.coding },
              { label: "Fitness", color: COLORS.success, mins: totalTime.fitness },
              { label: "Reading", color: COLORS.lavender, mins: totalTime.reading },
              { label: "Meditation", color: "#f472b6", mins: totalTime.meditation },
            ].map(({ label, color, mins }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: 13 }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{fmtMins(Math.round(mins / 60))}</span>
                </div>
                <div className="progress-bar">
                  <div style={{ height: "100%", width: `${(mins / totalMins) * 100}%`, background: color, borderRadius: 2, transition: "width 0.6s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Wheel */}
      <div className="card fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Life Balance Wheel</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <GrowthWheel areas={LIFE_AREAS} />
          <div style={{ flex: 1 }}>
            {LIFE_AREAS.map((a, i) => {
              const vals = [78, 65, 82, 45, 71];
              return (
                <div key={a.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{a.icon} {a.label}</span>
                    <span style={{ fontSize: 12, color: a.color, fontWeight: 600 }}>{vals[i]}%</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: "100%", width: `${vals[i]}%`, background: a.color, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInsightsPage({ user }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState("");
  const [voiced, setVoiced] = useState(false);

  const insights = [
    { icon: "📈", title: "Coding momentum", text: "You spent 28 hours coding this month — 35% more than last month. Your consistency in the evening 5–7 PM block is your peak performance window.", color: COLORS.accent },
    { icon: "🔮", title: "Future projection", text: "If you maintain this coding habit, you'll reach 500 hours within 10 months. At current pace, you'll be in the top 15% of learners your age.", color: COLORS.lavender },
    { icon: "⚠️", title: "Weak spot", text: "Finance learning is at 45% — your lowest life area. Consider dedicating just 15 mins/day to close this gap. Small consistent steps outperform sporadic effort.", color: COLORS.warning },
    { icon: "🌱", title: "Growth insight", text: "Your meditation habit has the highest streak (14 days). This consistency in mindfulness likely contributes to your overall 87 Sankalp score.", color: COLORS.success },
  ];

  const projections = [
    { habit: "Coding Practice", current: "90 hrs/month", projection: "500 hrs in 6 months", emoji: "⌨️" },
    { habit: "Meditation", current: "20 min/day", projection: "Advanced practitioner in 90 days", emoji: "🧘" },
    { habit: "Reading", current: "4 books/month", projection: "48 books/year → Top 1% reader", emoji: "📚" },
  ];

  function generateInsight() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInsight("Based on your 21-day streak and 87 weekly score, you're in the discipline sweet spot. Your biggest opportunity is Finance — adding just one focused session per week could transform this dimension within 3 months. Your coding momentum is exceptional; consider joining a 30-day coding challenge to leverage this energy peak.");
    }, 1500);
  }

  function voiceLog() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setVoiced(transcript);
      };
      rec.start();
    }
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 700, margin: "0 auto" }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Growth Insights</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Personalized intelligence for your journey</p>
      </div>

      {/* Generate insight */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.05s", background: "linear-gradient(135deg, rgba(79,142,247,0.06), rgba(167,139,250,0.06))" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ fontSize: 32, animation: "float 3s ease-in-out infinite" }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Monthly AI Analysis</div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.textSecondary, fontSize: 14 }}>
                <span style={{ width: 16, height: 16, border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Analyzing your growth patterns...
              </div>
            ) : insight ? (
              <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textSecondary }}>{insight}</p>
            ) : (
              <p style={{ fontSize: 14, color: COLORS.textMuted }}>Get a personalized monthly analysis of your habits and growth trajectory.</p>
            )}
            {!loading && <button className="btn-primary" style={{ marginTop: 12, padding: "8px 20px", fontSize: 13 }} onClick={generateInsight}>
              {insight ? "↺ Regenerate" : "✦ Generate insight"}
            </button>}
          </div>
        </div>
      </div>

      {/* Insights grid */}
      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 20, animationDelay: "0.1s" }}>
        {insights.map((ins, i) => (
          <div key={i} className="card" style={{ borderLeft: `3px solid ${ins.color}` }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{ins.icon}</span>
              <div className="syne" style={{ fontSize: 14, fontWeight: 600, color: ins.color }}>{ins.title}</div>
            </div>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>{ins.text}</p>
          </div>
        ))}
      </div>

      {/* Future projections */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.15s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>🔮 Future Self Projections</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projections.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < projections.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div style={{ fontSize: 28 }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p.habit}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>Now: {p.current}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: COLORS.success, background: "rgba(52,211,153,0.1)", borderRadius: 8, padding: "4px 10px" }}>{p.projection}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice logging */}
      <div className="card fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🔊 Voice Habit Logging</h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>Say "Mark coding as completed today" or any habit update</p>
        <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={voiceLog}>
          🎤 Start voice command
        </button>
        {voiced && <div style={{ marginTop: 12, padding: "10px 14px", background: COLORS.surfaceElevated, borderRadius: 10, fontSize: 13, color: COLORS.textSecondary }}>
          Heard: "{voiced}"
        </div>}
      </div>
    </div>
  );
}

function SocialPage({ user }) {
  const friends = [
    { name: "Priya Nair", score: 94, streak: 28, avatar: "P", skills: ["reading", "yoga"] },
    { name: "Rahul Dev", score: 82, streak: 14, avatar: "R", skills: ["coding", "fitness"] },
    { name: "Ananya K", score: 78, streak: 9, avatar: "A", skills: ["language", "meditation"] },
    { name: "Vikram S", score: 71, streak: 6, avatar: "V", skills: ["fitness", "finance"] },
  ];

  const challenges = [
    { name: "21-Day Coder", emoji: "⌨️", participants: 847, days: 21, active: true },
    { name: "Dawn Reader", emoji: "📚", participants: 312, days: 30, active: false },
    { name: "Mindful Morning", emoji: "🧘", participants: 1203, days: 14, active: true },
  ];

  return (
    <div style={{ padding: "24px 20px", maxWidth: 700, margin: "0 auto" }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Community</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Grow together, stay accountable</p>
      </div>

      {/* Leaderboard */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.05s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>🏆 Weekly Leaderboard</h3>

        {/* Current user rank */}
        <div style={{ padding: "12px 16px", background: "rgba(79,142,247,0.08)", border: `1px solid rgba(79,142,247,0.2)`, borderRadius: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="syne" style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent, width: 24 }}>3</span>
            <Avatar user={user} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user.name} (You)</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>🔥 {user.totalStreak}d streak</div>
            </div>
            <div className="syne" style={{ fontSize: 18, fontWeight: 700, color: COLORS.accent }}>{user.weekScore}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[{ name: "Priya Nair", score: 94, streak: 28, avatar: "P", rank: 1 }, { name: "Rahul Dev", score: 82, streak: 14, avatar: "R", rank: 2 }, { name: "Ananya K", score: 78, streak: 9, avatar: "A", rank: 4 }].map(f => (
            <div key={f.rank} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
              <span style={{ fontSize: 14, color: COLORS.textMuted, width: 24 }}>#{f.rank}</span>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.lavender}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "white" }}>{f.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>🔥 {f.streak}d</div>
              </div>
              <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: COLORS.textSecondary }}>{f.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.1s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>🎯 Growth Challenges</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {challenges.map(c => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: COLORS.surfaceElevated, borderRadius: 12, border: `1px solid ${c.active ? "rgba(52,211,153,0.2)" : COLORS.border}` }}>
              <div style={{ fontSize: 28 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{c.days} days · {c.participants.toLocaleString()} participants</div>
              </div>
              <button style={{
                background: c.active ? "rgba(52,211,153,0.15)" : "transparent",
                border: `1px solid ${c.active ? COLORS.success : COLORS.border}`,
                color: c.active ? COLORS.success : COLORS.textMuted,
                borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}>
                {c.active ? "✓ Joined" : "Join"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Share streak */}
      <div className="card fade-up" style={{ animationDelay: "0.15s", background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(248,113,113,0.06))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 40 }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Share your {user.totalStreak}-day streak!</div>
            <p style={{ fontSize: 13, color: COLORS.textMuted }}>Inspire others with your discipline journey</p>
          </div>
          <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>Share →</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ user }) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ padding: "24px 20px", maxWidth: 700, margin: "0 auto" }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Profile</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Your growth identity</p>
      </div>

      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.05s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <Avatar user={user} size={72} />
          <div>
            <div className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>{user.email}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 12, background: "rgba(79,142,247,0.1)", color: COLORS.accent, borderRadius: 6, padding: "3px 10px" }}>
                {user.status === "student" ? "🎓 Student" : "💼 Professional"}
              </span>
              <span className="streak-badge" style={{ fontSize: 11 }}>🔥 {user.longestStreak}d best streak</span>
            </div>
          </div>
          <button className="btn-secondary" style={{ marginLeft: "auto", padding: "8px 16px", fontSize: 12 }} onClick={() => setEditing(!editing)}>
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
          {[
            { label: "Total Streak", value: `${user.totalStreak}d`, icon: "🔥" },
            { label: "Best Streak", value: `${user.longestStreak}d`, icon: "🏆" },
            { label: "Sankalp Pts", value: user.sankalpPoints, icon: "⭐" },
            { label: "Week Score", value: user.weekScore, icon: "📊" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: COLORS.surfaceElevated, borderRadius: 12, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card fade-up" style={{ marginBottom: 16, animationDelay: "0.1s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Sankalp Points</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <CircularProgress value={(user.sankalpPoints % 100) / 100 * 100} size={80} stroke={5} color={COLORS.warning} label={user.sankalpPoints} sublabel="pts" />
          <div>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 10 }}>
              Earn +10 points every 21 consecutive days. Use points to protect your streak on missed days.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: COLORS.warning, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                🛡️ Freeze streak (10 pts)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card fade-up" style={{ animationDelay: "0.15s" }}>
        <h3 className="syne" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Growth Interests</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SKILLS.map(s => (
            <span key={s.id} className={`tag ${user.goals?.includes(s.id) ? "active" : ""}`}>
              {s.icon} {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(MOCK_HABITS);

  const NAV = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "insights", icon: "🤖", label: "AI" },
    { id: "social", icon: "🌍", label: "Social" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  function handleAuth(u) { setUser(u); setPage("routine"); }
  function handleRoutineComplete() { setPage("dashboard"); }

  const showNav = user && page !== "landing" && page !== "auth" && page !== "routine";

  return (
    <>
      <style>{globalCSS}</style>

      <div style={{ minHeight: "100vh", paddingBottom: showNav ? 80 : 0 }}>
        {page === "landing" && <LandingPage onEnter={() => setPage("auth")} />}
        {page === "auth" && <AuthPage onAuth={handleAuth} />}
        {page === "routine" && <RoutineBuilderPage user={user} onComplete={handleRoutineComplete} />}
        {page === "dashboard" && <DashboardPage user={user || MOCK_USER} habits={habits} setHabits={setHabits} />}
        {page === "calendar" && <CalendarPage habits={habits} />}
        {page === "analytics" && <AnalyticsPage user={user || MOCK_USER} />}
        {page === "insights" && <AIInsightsPage user={user || MOCK_USER} />}
        {page === "social" && <SocialPage user={user || MOCK_USER} />}
        {page === "profile" && <ProfilePage user={user || MOCK_USER} />}
      </div>

      {/* Bottom navigation */}
      {showNav && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(10,13,20,0.9)", backdropFilter: "blur(20px)",
          borderTop: `1px solid ${COLORS.border}`,
          display: "flex", justifyContent: "space-around", padding: "8px 4px",
        }}>
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
