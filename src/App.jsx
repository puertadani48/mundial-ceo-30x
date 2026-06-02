import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ════════════════════════════════════════════════════════
   MUNDIAL DEL CEO · 30X · MUNDIAL 2026
   Rediseño con estética broadcast deportivo
   Una propuesta de Daniel para Andrés Bilbao
═══════════════════════════════════════════════════════ */

/* ─── RESPONSIVE HOOK ──────────────────────────────────── */
function useScreen() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { mobile: w < 768, tablet: w < 1024, w };
}
const ScreenCtx = createContext({ mobile: false, tablet: false, w: 1200 });
function useR() { return useContext(ScreenCtx); }

/* ─── DESIGN TOKENS — Mundial Edition ───────────────────── */
const C = {
  // Base — stadium night
  bg:        "#0a1419",
  bgDeep:    "#050a0d",
  surface:   "#101c22",
  surfaceMid:"#16252d",
  surfaceHi: "#1e3038",
  border:    "#1d2e36",
  borderHi:  "#2d4754",

  // Brand (30X)
  lime:      "#c8f135",
  limeGlow:  "rgba(200,241,53,0.18)",
  limeFaint: "rgba(200,241,53,0.06)",

  // Mundial accents
  red:       "#e63946",     // banderas / urgencia / riesgo alto
  redDeep:   "#9d1f2b",
  gold:      "#ffb627",     // trofeo / top rankings
  goldGlow:  "rgba(255,182,39,0.2)",
  mint:      "#84dcc6",     // success / win
  blue:      "#3a86ff",     // info / data

  // Text
  white:     "#f8f4e9",
  text:      "#cdd6db",
  mid:       "#7b8a92",
  muted:     "#4d5b62",
};

const F = {
  display: "'Bebas Neue', 'Arial Black', sans-serif",   // titulares
  cond:    "'Barlow Condensed', 'Arial Narrow', sans-serif", // UI deportiva
  body:    "'DM Sans', 'Helvetica Neue', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

/* ─── MATCH DATA ────────────────────────────────────────── */
const MATCHES = [
  { id: 1, phase: "FASE DE GRUPOS · GRUPO D", venue: "Estadio Azteca · CDMX",      home: { n: "Argentina",     f: "🇦🇷", code: "ARG", color: "#75aadb" }, away: { n: "Polonia",       f: "🇵🇱", code: "POL", color: "#dc143c" }, date: "14 JUN", time: "20:00", odds: { home: 1.4,  draw: 4.2, away: 6.5 } },
  { id: 2, phase: "FASE DE GRUPOS · GRUPO F", venue: "MetLife Stadium · NJ",       home: { n: "México",        f: "🇲🇽", code: "MEX", color: "#006847" }, away: { n: "Países Bajos",  f: "🇳🇱", code: "NED", color: "#ff6c00" }, date: "17 JUN", time: "18:00", odds: { home: 5.5,  draw: 3.8, away: 1.6 } },
  { id: 3, phase: "FASE DE GRUPOS · GRUPO G", venue: "SoFi Stadium · LA",          home: { n: "Brasil",        f: "🇧🇷", code: "BRA", color: "#fedf00" }, away: { n: "Colombia",      f: "🇨🇴", code: "COL", color: "#fcd116" }, date: "21 JUN", time: "21:00", odds: { home: 2.2,  draw: 3.2, away: 3.0 } },
  { id: 4, phase: "FASE DE GRUPOS · GRUPO C", venue: "AT&T Stadium · Dallas",      home: { n: "España",        f: "🇪🇸", code: "ESP", color: "#aa151b" }, away: { n: "Alemania",      f: "🇩🇪", code: "GER", color: "#000000" }, date: "24 JUN", time: "15:00", odds: { home: 2.5,  draw: 3.0, away: 2.8 } },
  { id: 5, phase: "OCTAVOS DE FINAL",         venue: "Levi's Stadium · SF",        home: { n: "Curazao",       f: "🇨🇼", code: "CUR", color: "#00257d" }, away: { n: "Inglaterra",    f: "🏴", code: "ENG", color: "#cf142b" }, date: "30 JUN", time: "16:00", odds: { home: 25.0, draw: 8.0, away: 1.1 } },
  { id: 6, phase: "OCTAVOS DE FINAL",         venue: "Mercedes-Benz · Atlanta",    home: { n: "Francia",       f: "🇫🇷", code: "FRA", color: "#002654" }, away: { n: "Uruguay",       f: "🇺🇾", code: "URU", color: "#7cb9e8" }, date: "02 JUL", time: "20:00", odds: { home: 1.8,  draw: 3.5, away: 4.5 } },
  { id: 7, phase: "CUARTOS DE FINAL",         venue: "Hard Rock · Miami",          home: { n: "Portugal",      f: "🇵🇹", code: "POR", color: "#006600" }, away: { n: "USA",           f: "🇺🇸", code: "USA", color: "#bf0a30" }, date: "05 JUL", time: "19:00", odds: { home: 2.0,  draw: 3.2, away: 3.5 } },
  { id: 8, phase: "SEMIFINAL",                venue: "MetLife Stadium · NJ",       home: { n: "Croacia",       f: "🇭🇷", code: "CRO", color: "#171796" }, away: { n: "Marruecos",     f: "🇲🇦", code: "MAR", color: "#c1272d" }, date: "14 JUL", time: "20:00", odds: { home: 2.2,  draw: 3.0, away: 3.4 } },
];

const STARTING_CAPITAL = 100000;
const MIN_PER_BET = 1000;
const MAX_PER_BET = 50000;

/* ─── MOCK LEADERBOARD ──────────────────────────────────── */
const SEED_BOARD = [
  { name: "Diego R.",   company: "Stack SaaS",     stage: "Series A",  score: 287000, risk: "Alto",  div: 8 },
  { name: "María V.",   company: "Mercata.io",     stage: "Validado",  score: 264500, risk: "Medio", div: 7 },
  { name: "Juan P.",    company: "Bnka Pay",       stage: "Series A",  score: 248200, risk: "Alto",  div: 6 },
  { name: "Camila T.",  company: "Last Mile",      stage: "Validado",  score: 231000, risk: "Medio", div: 8 },
  { name: "Roberto M.", company: "Cohorte Edu",    stage: "MVP",       score: 218400, risk: "Bajo",  div: 7 },
  { name: "Andrea L.",  company: "Vital Care",     stage: "Series A",  score: 201700, risk: "Alto",  div: 5 },
  { name: "Felipe G.",  company: "Inmueble Pro",   stage: "Validado",  score: 188000, risk: "Medio", div: 6 },
  { name: "Laura C.",   company: "AgroLink",       stage: "MVP",       score: 175300, risk: "Alto",  div: 7 },
];

const SYSTEM_FEEDBACK = `Eres Andrés Bilbao — cofundador de Rappi, CEO de 30X, caleño. Acabas de revisar las apuestas que un founder hizo en la Mundial del CEO de 30X.

Tu trabajo es darle feedback en TU VOZ:
- Caleño natural: usa "venga", "parce", "de una", "bacano", "eso sí", "le metió" con moderación — una o dos expresiones, que suene natural
- Directo, honesto. Si está apostando mal, lo dices.
- Habla como inversionista: el juego es proxy de cómo invierte y decide
- 4 a 6 oraciones máximo
- NO uses bullet points ni listas
- Saltos de línea simples para respirar

QUÉ ANALIZAR:
1. ¿Diversificó o metió todo a un partido?
2. ¿Apuesta a favoritos seguros o tiene convicción real?
3. ¿Alguna apuesta brillante o terrible?
4. Conecta con cómo probablemente decide en su empresa

CIERRA con UN consejo aplicable a su negocio. No genérico.

NO uses coaching ("¡tú puedes!"), ni "te felicito", ni frases vacías.

Responde en español colombiano.`;

/* ─── STORAGE ───────────────────────────────────────────── */
function loadBoard() {
  try {
    const r = localStorage.getItem("mundial:board:v2");
    return r ? JSON.parse(r) : SEED_BOARD;
  } catch { return SEED_BOARD; }
}
function submitToBoard(entry) {
  try {
    const cur = loadBoard();
    const next = [...cur, entry].sort((a, b) => b.score - a.score).slice(0, 50);
    localStorage.setItem("mundial:board:v2", JSON.stringify(next));
    return next;
  } catch { return [entry, ...SEED_BOARD]; }
}

/* ════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const screen = useScreen();
  const [view, setView] = useState("intro");
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [board, setBoard] = useState(SEED_BOARD);

  useEffect(() => { setBoard(loadBoard()); }, []);

  return (
    <ScreenCtx.Provider value={screen}>
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at top, ${C.surface} 0%, ${C.bg} 50%, ${C.bgDeep} 100%)`,
      color: C.white, fontFamily: F.body, overflowX: "hidden",
    }}>
      <StadiumPattern />
      <TopBar view={view} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {view === "intro"      && <Intro      onStart={() => setView("lead")} />}
        {view === "lead"       && <Lead       onSubmit={u => { setUser(u); setView("game"); }} />}
        {view === "game"       && <Game       user={user} bets={bets} setBets={setBets} onSubmit={() => setView("submitting")} />}
        {view === "submitting" && <Submitting user={user} bets={bets} onDone={(fb, sc) => { setFeedback(fb); setScore(sc); setView("feedback"); }} />}
        {view === "feedback"   && <Feedback   user={user} bets={bets} feedback={feedback} score={score} onContinue={async () => {
                                    const entry = {
                                      name: user.name.split(" ")[0] + " " + (user.name.split(" ")[1]?.[0] || "") + ".",
                                      company: user.company, stage: user.stage,
                                      score: score.value, risk: score.risk, div: score.diversification, isUser: true,
                                    };
                                    setBoard(submitToBoard(entry));
                                    setView("board");
                                  }} />}
        {view === "board"      && <Board      board={board} user={user} score={score} />}
      </div>
      <Footer />
      <GlobalStyles />
    </div>
    </ScreenCtx.Provider>
  );
}

/* ════════════════════════════════════════════════════════
   PATTERN BG — Estadio + balón
═══════════════════════════════════════════════════════ */
function StadiumPattern() {
  return (
    <>
      {/* Pattern hexagonal (balón) */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><polygon points='30,2 56,17 56,43 30,58 4,43 4,17' fill='none' stroke='%231d2e36' stroke-width='0.5'/></svg>")`,
        opacity: 0.4,
      }} />
      {/* Glow superior */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "120%", height: "60vh", pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at top, ${C.limeGlow} 0%, transparent 60%)`,
      }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════ */
function TopBar({ view }) {
  const { mobile } = useR();
  const map = { intro: "INICIO", lead: "REGISTRO", game: "APUESTAS", submitting: "ANÁLISIS", feedback: "ANÁLISIS", board: "RANKING" };
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,20,25,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${C.border}`,
      padding: mobile ? "0 14px" : "0 24px", height: mobile ? 52 : 64,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 18 }}>
        <span style={{ fontFamily: F.display, fontSize: mobile ? 22 : 26, letterSpacing: "0.02em" }}>
          3<span style={{ color: C.lime }}>0X</span>
        </span>
        {!mobile && <>
          <div style={{ width: 1, height: 24, background: C.border }} />
          <div>
            <div style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: C.lime, textTransform: "uppercase" }}>FIFA World Cup 2026</div>
            <div style={{ fontFamily: F.cond, fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", color: C.mid }}>MUNDIAL DEL CEO · BETA</div>
          </div>
        </>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 14 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.limeFaint, border: `1px solid rgba(200,241,53,0.2)`,
          borderRadius: 100, padding: "5px 12px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime, boxShadow: `0 0 10px ${C.lime}`, animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: C.lime }}>LIVE</span>
        </div>
        {!mobile && <span style={{ fontFamily: F.cond, fontSize: 11, letterSpacing: "0.12em", color: C.mid, textTransform: "uppercase" }}>
          {map[view] || "..."}
        </span>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW · INTRO
═══════════════════════════════════════════════════════ */
function Intro({ onStart }) {
  const { mobile, tablet } = useR();
  const px = mobile ? "16px" : "24px";
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: `0 ${px} 80px` }}>
      {/* HERO */}
      <div style={{ position: "relative", padding: mobile ? "40px 0 30px" : "80px 0 60px", overflow: "hidden" }}>
        {/* Trofeo geométrico */}
        <Trophy />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <FlagDot color={C.red} />
              <FlagDot color={C.white} />
              <FlagDot color={C.blue} />
            </div>
            <div style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: C.lime, textTransform: "uppercase" }}>
              Edición única · Junio – Julio 2026
            </div>
          </div>

          {/* Headline atlética */}
          <h1 style={{
            fontFamily: F.display, fontSize: mobile ? 48 : tablet ? 80 : 132, lineHeight: 0.86,
            letterSpacing: "0.005em", color: C.white, margin: 0,
          }}>
            APUESTA<br />
            EL MUNDIAL<br />
            COMO UN <span style={{ color: C.lime, position: "relative" }}>CEO<span style={{ position: "absolute", bottom: 4, left: 0, right: 0, height: 6, background: C.lime, opacity: 0.3 }} /></span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            marginTop: mobile ? 20 : 36, fontSize: mobile ? 14 : 18, fontWeight: 300, color: C.text,
            maxWidth: 560, lineHeight: 1.65,
          }}>
            $100.000 USD simulados. 8 partidos clave. Un test brutal de cómo asignas capital, gestionas riesgo y decides bajo presión — disfrazado del Mundial 2026.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: mobile ? 28 : 44, flexWrap: "wrap" }}>
            <button onClick={onStart} style={btnPrimary}>
              <span>EMPEZAR A APOSTAR</span>
              <span style={{ fontSize: 16 }}>→</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.cond, fontSize: 13, color: C.mid, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <ClockIcon /> Toma 3 minutos
            </div>
          </div>
        </div>

        {/* Bandera strip */}
        <FlagStrip />
      </div>

      {/* SCOREBOARD — stats principales */}
      <Scoreboard />

      {/* SECCIÓN COMO FUNCIONA */}
      <div style={{ marginTop: 100 }}>
        <SectionHeader n="01" label="EL JUEGO" title="Las reglas son simples" />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : tablet ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginTop: 40 }}>
          {[
            { n: "01", t: "Recibes $100K USD", d: "Capital simulado. Lo administras como mejor te parezca." },
            { n: "02", t: "Apuestas a 8 partidos", d: "Eliges ganador y cuánto capital metes. $1K min, $50K max." },
            { n: "03", t: "Andrés AI te analiza", d: "Revisa tu estrategia como inversionista. Te dice qué dice de ti." },
            { n: "04", t: "Top 3 gana beca", d: "Inmersivo presencial 30X + mentoría directa con Andrés." },
          ].map(s => (
            <MatchDayCard key={s.n} {...s} />
          ))}
        </div>
      </div>

      {/* SECCIÓN FILOSOFÍA */}
      <div style={{ marginTop: mobile ? 60 : 100, display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 28 : 48, alignItems: "center" }}>
        <div>
          <SectionHeader n="02" label="LA TESIS" />
          <h3 style={{
            fontFamily: F.display, fontSize: mobile ? 28 : 56, lineHeight: 0.95,
            color: C.white, marginTop: 16, letterSpacing: "0.005em",
          }}>
            SI NO SABES APOSTAR A 8 PARTIDOS — <span style={{ color: C.lime }}>¿CÓMO VAS A TOMAR 1.000 DECISIONES EN TU EMPRESA?</span>
          </h3>
          <p style={{ marginTop: 24, fontSize: 15, color: C.text, lineHeight: 1.7 }}>
            Un juego del Mundial es el experimento más honesto que existe sobre cómo piensas. Te obliga a decidir con información incompleta, asumir riesgos, diversificar o concentrar, creer en una convicción cuando los números no la favorecen.
          </p>
          <p style={{ marginTop: 16, fontSize: 15, color: C.text, lineHeight: 1.7 }}>
            Exactamente lo que haces como founder, todos los días.
          </p>
        </div>
        <QuoteCard />
      </div>

      {/* CTA FINAL */}
      <FinalCTA onStart={onStart} />
    </div>
  );
}

function Trophy() {
  return (
    <div style={{
      position: "absolute", top: 60, right: -40, width: 320, height: 320,
      opacity: 0.9, pointerEvents: "none", zIndex: 1,
    }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.gold} stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.gold} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Trofeo estilizado */}
        <ellipse cx="100" cy="60" rx="50" ry="35" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.6" />
        <ellipse cx="100" cy="65" rx="45" ry="30" fill="url(#g1)" opacity="0.4" />
        <path d="M 60 80 Q 50 90 50 100 Q 50 110 60 110" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.5" />
        <path d="M 140 80 Q 150 90 150 100 Q 150 110 140 110" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.5" />
        <rect x="85" y="100" width="30" height="40" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.5" />
        <ellipse cx="100" cy="140" rx="35" ry="8" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.5" />
        <rect x="60" y="148" width="80" height="6" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.6" />
        {/* Lima glow */}
        <circle cx="100" cy="60" r="80" fill={C.limeGlow} opacity="0.15" />
      </svg>
    </div>
  );
}

function FlagDot({ color }) {
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />;
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={C.mid} strokeWidth="1.2" />
      <path d="M7 4v3l2 2" stroke={C.mid} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FlagStrip() {
  const { mobile } = useR();
  const flags = ["🇦🇷", "🇧🇷", "🇲🇽", "🇪🇸", "🇫🇷", "🇩🇪", "🇵🇹", "🇮🇹", "🇺🇸", "🇨🇴", "🇺🇾", "🇳🇱"];
  return (
    <div style={{ position: "relative", marginTop: 80, paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", color: C.mid, textTransform: "uppercase", marginBottom: 16 }}>
        SELECCIONES EN JUEGO
      </div>
      <div style={{ display: "flex", gap: mobile ? 10 : 18, fontSize: mobile ? 28 : 36, flexWrap: "wrap" }}>
        {flags.map((f, i) => (
          <span key={i} style={{
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
            transition: "transform 0.2s",
            cursor: "default",
          }}>{f}</span>
        ))}
        <span style={{ fontFamily: F.cond, fontWeight: 700, color: C.mid, fontSize: 14, letterSpacing: "0.1em", alignSelf: "center" }}>+ 36 MÁS</span>
      </div>
    </div>
  );
}

function Scoreboard() {
  const { mobile } = useR();
  const stats = [
    { v: "$100K", l: "Capital simulado", c: C.lime },
    { v: "8",     l: "Partidos clave",    c: C.white },
    { v: "TOP 3", l: "Premiados",          c: C.gold },
    { v: "AI",    l: "Andrés analiza",     c: C.mint },
  ];
  return (
    <div style={{
      marginTop: 40, background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 4, overflow: "hidden",
    }}>
      <div style={{
        background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.lime}, ${C.mint})`,
        height: 3,
      }} />
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: "28px 24px",
            borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: F.display, fontSize: mobile ? 32 : 48, color: s.c, lineHeight: 1, letterSpacing: "0.01em" }}>{s.v}</div>
            <div style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: C.mid, marginTop: 8, textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchDayCard({ n, t, d }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 4, padding: 24, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -10, right: -10, fontFamily: F.display, fontSize: 90, color: C.surfaceHi, lineHeight: 1, opacity: 0.6 }}>{n}</div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: F.cond, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: C.lime, marginBottom: 12, textTransform: "uppercase" }}>STEP {n}</div>
        <div style={{ fontFamily: F.display, fontSize: 28, color: C.white, lineHeight: 1.05, marginBottom: 10, letterSpacing: "0.01em" }}>{t}</div>
        <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.55 }}>{d}</div>
      </div>
    </div>
  );
}

function QuoteCard() {
  const { mobile } = useR();
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surfaceMid} 100%)`,
      border: `1px solid ${C.borderHi}`,
      padding: 40, borderRadius: 4, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: 16,
        fontFamily: F.display, fontSize: 200, color: C.limeFaint, lineHeight: 1,
      }}>"</div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily: F.display, fontSize: 30, lineHeight: 1.15,
          color: C.white, letterSpacing: "0.005em", marginBottom: 28,
        }}>
          LA DIFERENCIA ENTRE UN FOUNDER QUE ESCALA Y UNO QUE SOBREVIVE NO ES LA IDEA — ES <span style={{ color: C.lime }}>CÓMO DECIDE BAJO PRESIÓN.</span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <AvatarAB size={40} />
          <div>
            <div style={{ fontFamily: F.cond, fontSize: 14, fontWeight: 700, color: C.white, letterSpacing: "0.05em" }}>ANDRÉS BILBAO</div>
            <div style={{ fontSize: 11, color: C.mid }}>Co-founder Rappi · CEO 30X</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalCTA({ onStart }) {
  const { mobile } = useR();
  return (
    <div style={{
      marginTop: 100, padding: "72px 32px", textAlign: "center", position: "relative",
      background: `radial-gradient(ellipse at center, ${C.limeFaint} 0%, transparent 70%)`,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `repeating-linear-gradient(90deg, transparent, transparent 60px, ${C.border} 60px, ${C.border} 61px)`,
        opacity: 0.2,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: F.cond, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: C.lime, marginBottom: 16, textTransform: "uppercase" }}>
          ▼ INSCRIPCIONES ABIERTAS ▼
        </div>
        <h3 style={{ fontFamily: F.display, fontSize: mobile ? 32 : 64, color: C.white, marginBottom: 16, letterSpacing: "0.005em", lineHeight: 0.95 }}>
          EL MUNDIAL EMPIEZA EN<br />
          <span style={{ color: C.lime }}>10 DÍAS.</span> ¿VAS A JUGAR?
        </h3>
        <p style={{ fontSize: 14, color: C.mid, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Inscripciones cierran cuando empieza el primer partido. Después solo se puede mirar.
        </p>
        <button onClick={onStart} style={btnPrimary}>
          <span>ENTRAR AL MUNDIAL</span>
          <span style={{ fontSize: 16 }}>→</span>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW · LEAD CAPTURE
═══════════════════════════════════════════════════════ */
function Lead({ onSubmit }) {
  const { mobile } = useR();
  const [form, setForm] = useState({ name: "", email: "", company: "", stage: "", revenue: "" });
  const valid = form.name && form.email && form.company && form.stage;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: mobile ? "40px 16px" : "60px 24px" }}>
      <ProgressBar step={1} />

      <h2 style={{ fontFamily: F.display, fontSize: mobile ? 36 : 60, lineHeight: 0.95, color: C.white, marginTop: 28, marginBottom: 14, letterSpacing: "0.005em" }}>
        ANTES DE DARTE<br />TU CAPITAL
      </h2>
      <p style={{ fontSize: 15, color: C.text, marginBottom: 36, lineHeight: 1.65 }}>
        Andrés cruza tus apuestas con tu perfil de empresa. Por eso necesita saber quién eres.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Nombre completo" v={form.name} onChange={v => setForm({...form, name: v})} placeholder="María Ramírez" />
        <Field label="Email" v={form.email} onChange={v => setForm({...form, email: v})} placeholder="maria@empresa.com" type="email" />
        <Field label="Empresa" v={form.company} onChange={v => setForm({...form, company: v})} placeholder="Acme Logistics" />
        <Select label="Etapa de tu empresa" v={form.stage} onChange={v => setForm({...form, stage: v})} options={["Idea / Pre-MVP", "MVP en desarrollo", "MVP validado", "Series A / Escalando", "Series B+", "Bootstrapped rentable"]} />
        <Select label="Facturación mensual (opcional)" v={form.revenue} onChange={v => setForm({...form, revenue: v})} options={["No facturo aún", "<$10K USD", "$10K - $50K", "$50K - $250K", "$250K - $1M", "$1M+"]} />
      </div>

      <button
        onClick={() => valid && onSubmit(form)}
        disabled={!valid}
        style={{ ...btnPrimary, width: "100%", marginTop: 32, justifyContent: "center", opacity: valid ? 1 : 0.4, cursor: valid ? "pointer" : "not-allowed" }}
      >
        <span>RECIBIR MIS $100.000 USD</span>
        <span style={{ fontSize: 16 }}>→</span>
      </button>

      <p style={{ fontSize: 11, color: C.muted, marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
        Tu información solo la verá el equipo de 30X. No spam, no venta de datos.
      </p>
    </div>
  );
}

function ProgressBar({ step }) {
  const steps = ["REGISTRO", "APUESTAS", "ANÁLISIS"];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3,
            background: i < step ? C.lime : C.border,
            transition: "all 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.cond, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: C.mid, textTransform: "uppercase" }}>
        <span style={{ color: step >= 1 ? C.lime : C.mid }}>{steps[0]}</span>
        <span style={{ color: step >= 2 ? C.lime : C.mid }}>{steps[1]}</span>
        <span style={{ color: step >= 3 ? C.lime : C.mid }}>{steps[2]}</span>
      </div>
    </div>
  );
}

function Field({ label, v, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <input
        type={type} value={v} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={fieldInput}
      />
    </div>
  );
}
function Select({ label, v, onChange, options }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <select
        value={v} onChange={e => onChange(e.target.value)}
        style={{
          ...fieldInput,
          color: v ? C.white : C.muted, appearance: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%237b8a92' stroke-width='1.5' fill='none'/></svg>")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}
      >
        <option value="">Selecciona una opción</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW · GAME BOARD
═══════════════════════════════════════════════════════ */
function Game({ user, bets, setBets, onSubmit }) {
  const { mobile, tablet } = useR();
  const invested = Object.values(bets).reduce((s, b) => s + (b?.amount || 0), 0);
  const remaining = STARTING_CAPITAL - invested;
  const betsCount = Object.values(bets).filter(b => b?.pick && b?.amount > 0).length;
  const canSubmit = betsCount >= 3;
  const potentialReturn = Object.entries(bets).reduce((s, [id, b]) => {
    if (!b?.pick || !b?.amount) return s;
    const m = MATCHES.find(x => x.id === parseInt(id));
    return s + b.amount * (m?.odds[b.pick] || 0);
  }, 0);

  function updateBet(matchId, partial) {
    setBets(prev => ({ ...prev, [matchId]: { ...prev[matchId], ...partial } }));
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: mobile ? "24px 16px 80px" : "32px 24px 100px" }}>
      <ProgressBar step={2} />

      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: F.display, fontSize: mobile ? 32 : 52, lineHeight: 0.95, color: C.white, letterSpacing: "0.005em" }}>
          BIENVENIDO, <span style={{ color: C.lime }}>{user?.name?.split(" ")[0]?.toUpperCase()}</span>
        </h2>
        <p style={{ fontSize: 14, color: C.mid, marginTop: 8 }}>
          Apuesta a mínimo 3 partidos. Máximo $50K por partido. Diversificar es opcional — fallar no.
        </p>
      </div>

      {/* PORTFOLIO BAR — estilo scoreboard */}
      <div style={{
        position: "sticky", top: 64, zIndex: 50,
        background: `linear-gradient(180deg, ${C.surface} 0%, ${C.surfaceMid} 100%)`,
        border: `1px solid ${C.borderHi}`,
        borderRadius: 4, padding: "20px 24px", marginBottom: 32,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
      }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.lime})`, marginTop: -20, marginLeft: -24, marginRight: -24, marginBottom: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr auto", gap: mobile ? 16 : 24, alignItems: "center" }}>
          <Stat label="CAPITAL" value={`$${STARTING_CAPITAL.toLocaleString()}`} color={C.mid} />
          <Stat label="INVERTIDO" value={`$${invested.toLocaleString()}`} color={C.white} />
          <Stat label="DISPONIBLE" value={`$${remaining.toLocaleString()}`} color={remaining > 0 ? C.lime : C.red} />
          <Stat label="SI ACIERTAS TODO" value={`$${Math.round(potentialReturn).toLocaleString()}`} color={C.gold} sub={`+${invested > 0 ? Math.round((potentialReturn / invested - 1) * 100) : 0}%`} />
          <button
            onClick={() => canSubmit && onSubmit()}
            disabled={!canSubmit}
            style={{
              ...btnPrimary, padding: "12px 24px",
              opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            <span>{canSubmit ? `ENVIAR (${betsCount})` : `FALTAN ${3 - betsCount}`}</span>
            {canSubmit && <span style={{ fontSize: 14 }}>→</span>}
          </button>
        </div>
      </div>

      {/* MATCHES GRID */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
        {MATCHES.map(m => (
          <MatchCard
            key={m.id} match={m}
            bet={bets[m.id]}
            onUpdate={partial => updateBet(m.id, partial)}
            remaining={remaining}
          />
        ))}
      </div>

      <p style={{ marginTop: 32, fontSize: 11, color: C.muted, textAlign: "center" }}>
        Partidos hipotéticos para fines del demo. La versión final usará el fixture oficial FIFA 2026.
      </p>
    </div>
  );
}

function MatchCard({ match, bet, onUpdate, remaining }) {
  const m = match;
  const current = bet?.amount || 0;
  const pick = bet?.pick;
  const hasPick = !!pick;
  const dynMax = Math.min(MAX_PER_BET, remaining + current);

  return (
    <div style={{
      background: hasPick
        ? `linear-gradient(135deg, ${C.surface} 0%, ${C.limeFaint} 100%)`
        : C.surface,
      border: `1px solid ${hasPick ? "rgba(200,241,53,0.35)" : C.border}`,
      borderRadius: 4, overflow: "hidden", transition: "all 0.2s",
      position: "relative",
    }}>
      {/* Top stripe — colores de equipos */}
      <div style={{ display: "flex", height: 4 }}>
        <div style={{ flex: 1, background: m.home.color }} />
        <div style={{ flex: 1, background: m.away.color }} />
      </div>

      <div style={{ padding: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: F.cond, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: C.lime, textTransform: "uppercase" }}>
              {m.phase}
            </div>
            <div style={{ fontSize: 10, color: C.mid, marginTop: 3 }}>
              📍 {m.venue}
            </div>
          </div>
          <div style={{
            textAlign: "right",
            background: C.surfaceHi, border: `1px solid ${C.border}`,
            borderRadius: 3, padding: "5px 10px",
          }}>
            <div style={{ fontFamily: F.cond, fontSize: 12, fontWeight: 700, color: C.white, letterSpacing: "0.05em" }}>{m.date}</div>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.mid }}>{m.time}</div>
          </div>
        </div>

        {/* Teams big */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <TeamBig flag={m.home.f} name={m.home.n} code={m.home.code} align="left" />
          <div style={{ fontFamily: F.display, fontSize: 18, color: C.muted, letterSpacing: "0.05em" }}>VS</div>
          <TeamBig flag={m.away.f} name={m.away.n} code={m.away.code} align="right" />
        </div>

        {/* Pick buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: hasPick ? 16 : 0 }}>
          <PickBtn label={m.home.code} odds={m.odds.home} active={pick === "home"} onClick={() => onUpdate({ pick: "home", amount: bet?.amount || 5000 })} />
          <PickBtn label="EMP" odds={m.odds.draw} active={pick === "draw"} onClick={() => onUpdate({ pick: "draw", amount: bet?.amount || 5000 })} />
          <PickBtn label={m.away.code} odds={m.odds.away} active={pick === "away"} onClick={() => onUpdate({ pick: "away", amount: bet?.amount || 5000 })} />
        </div>

        {/* Capital slider */}
        {hasPick && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontFamily: F.cond, fontSize: 10, color: C.mid, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>CAPITAL APOSTADO</span>
              <span style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 700, color: C.lime }}>${current.toLocaleString()}</span>
            </div>
            <input
              type="range" min={MIN_PER_BET} max={dynMax} step={500} value={current}
              onChange={e => onUpdate({ amount: parseInt(e.target.value) })}
              style={{ width: "100%", accentColor: C.lime, cursor: "pointer" }}
            />
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {[5000, 10000, 25000, 50000].filter(p => p <= dynMax).map(p => (
                <button key={p} onClick={() => onUpdate({ amount: p })} style={{
                  flex: 1, fontFamily: F.cond, fontSize: 12, fontWeight: 700, padding: "6px 0",
                  background: current === p ? C.lime : "transparent",
                  color: current === p ? C.bg : C.mid,
                  border: `1px solid ${current === p ? C.lime : C.border}`,
                  borderRadius: 3, cursor: "pointer", transition: "all 0.15s",
                  letterSpacing: "0.05em",
                }}>
                  ${p / 1000}K
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", background: C.bg, borderRadius: 3, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.cond, fontSize: 11, color: C.mid, letterSpacing: "0.1em", textTransform: "uppercase" }}>SI ACIERTAS →</span>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: C.gold, fontWeight: 700 }}>
                ${Math.round(current * m.odds[pick]).toLocaleString()}
              </span>
            </div>
            <button onClick={() => onUpdate({ pick: null, amount: 0 })} style={{
              background: "transparent", border: "none", color: C.muted, fontSize: 11,
              cursor: "pointer", marginTop: 8, padding: 0, textDecoration: "underline",
            }}>
              Eliminar apuesta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamBig({ flag, name, code, align }) {
  const right = align === "right";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: right ? "flex-end" : "flex-start" }}>
      {right && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: F.cond, fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: "0.02em", lineHeight: 1 }}>{name.toUpperCase()}</div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.mid, marginTop: 3 }}>{code}</div>
        </div>
      )}
      <div style={{
        fontSize: 40, lineHeight: 1,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
      }}>{flag}</div>
      {!right && (
        <div>
          <div style={{ fontFamily: F.cond, fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: "0.02em", lineHeight: 1 }}>{name.toUpperCase()}</div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.mid, marginTop: 3 }}>{code}</div>
        </div>
      )}
    </div>
  );
}

function PickBtn({ label, odds, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "12px 6px",
      background: active ? C.lime : C.surfaceHi,
      border: `1px solid ${active ? C.lime : C.border}`,
      color: active ? C.bg : C.white,
      borderRadius: 3, cursor: "pointer",
      transition: "all 0.15s",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <span style={{ fontFamily: F.cond, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: 11, opacity: 0.8 }}>{odds.toFixed(1)}x</span>
    </button>
  );
}

function Stat({ label, value, color, sub }) {
  return (
    <div>
      <div style={{ fontFamily: F.cond, fontSize: 10, color: C.mid, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 400, color, lineHeight: 1, letterSpacing: "0.01em" }}>{value}</div>
      {sub && <div style={{ fontFamily: F.cond, fontSize: 11, color: C.lime, marginTop: 4, fontWeight: 700, letterSpacing: "0.05em" }}>{sub}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SUBMITTING + FEEDBACK
═══════════════════════════════════════════════════════ */
function Submitting({ user, bets, onDone }) {
  const { mobile } = useR();
  useEffect(() => {
    (async () => {
      const betsList = Object.entries(bets)
        .filter(([, b]) => b?.pick && b?.amount > 0)
        .map(([id, b]) => {
          const m = MATCHES.find(x => x.id === parseInt(id));
          const winner = b.pick === "home" ? m.home.n : b.pick === "away" ? m.away.n : "Empate";
          return `- ${m.home.n} vs ${m.away.n} (${m.phase}): apostó por ${winner}, $${b.amount.toLocaleString()} USD, odds ${m.odds[b.pick].toFixed(1)}x`;
        }).join("\n");

      const invested = Object.values(bets).reduce((s, b) => s + (b?.amount || 0), 0);
      const reserve = STARTING_CAPITAL - invested;
      const numBets = Object.values(bets).filter(b => b?.pick).length;
      const maxBet = Math.max(...Object.values(bets).map(b => b?.amount || 0));
      const concentration = Math.round((maxBet / invested) * 100);

      const userMsg = `Acabo de hacer mis apuestas en la Mundial del CEO. Soy ${user.name}, fundador/a de ${user.company}, etapa: ${user.stage}${user.revenue ? `, facturación: ${user.revenue}` : ""}.

Mis apuestas:
${betsList}

Resumen:
- Capital total: $100.000 USD
- Invertido: $${invested.toLocaleString()} (${Math.round(invested/1000)}%)
- Reserva: $${reserve.toLocaleString()}
- Cantidad de apuestas: ${numBets}
- Apuesta más grande: $${maxBet.toLocaleString()} (${concentration}% de lo invertido)

¿Qué piensas, Andrés? ¿Qué dice esto de mí como CEO?`;

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: SYSTEM_FEEDBACK,
            messages: [{ role: "user", content: userMsg }],
          }),
        });
        const data = await res.json();
        const text = data.content?.[0]?.text || "Tu portafolio tiene buenas lecturas. El equipo de 30X te enviará el análisis completo.";
        onDone(text, calcScore(bets));
      } catch {
        onDone("Andrés está revisando tu portafolio. Mientras tanto, mira dónde quedaste en el ranking.", calcScore(bets));
      }
    })();
  }, []);

  return (
    <div style={{ padding: mobile ? "80px 16px" : "120px 24px", textAlign: "center", maxWidth: 540, margin: "0 auto" }}>
      <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
        <AvatarAB size={96} />
        <div style={{
          position: "absolute", inset: -8, borderRadius: "50%",
          border: `2px solid ${C.lime}`, opacity: 0.5,
          animation: "ping 1.5s ease-in-out infinite",
        }} />
      </div>
      <h3 style={{ fontFamily: F.display, fontSize: mobile ? 28 : 40, color: C.white, marginBottom: 14, letterSpacing: "0.005em", lineHeight: 0.95 }}>
        ANDRÉS ESTÁ REVISANDO<br />TU PORTAFOLIO...
      </h3>
      <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.7 }}>
        Cruza tus apuestas con tu perfil de empresa. Esto toma unos segundos.
      </p>
    </div>
  );
}

function calcScore(bets) {
  const valid = Object.entries(bets).filter(([, b]) => b?.pick && b?.amount > 0);
  const invested = valid.reduce((s, [, b]) => s + b.amount, 0);
  const reserve = STARTING_CAPITAL - invested;
  const numBets = valid.length;
  const maxBet = valid.length > 0 ? Math.max(...valid.map(([, b]) => b.amount)) : 0;
  const concentration = invested > 0 ? maxBet / invested : 0;
  const potentialReturn = valid.reduce((s, [id, b]) => {
    const m = MATCHES.find(x => x.id === parseInt(id));
    return s + b.amount * m.odds[b.pick];
  }, 0);
  const avgOdds = invested > 0 ? valid.reduce((s, [id, b]) => {
    const m = MATCHES.find(x => x.id === parseInt(id));
    return s + (m.odds[b.pick] * b.amount);
  }, 0) / invested : 0;
  const risk = avgOdds > 3.5 ? "Alto" : avgOdds > 2 ? "Medio" : "Bajo";
  let score = potentialReturn;
  if (concentration > 0.6) score *= 0.85;
  if (numBets >= 6) score *= 1.1;
  if (reserve > 30000) score *= 1.05;
  return { value: Math.round(score), risk, diversification: numBets, concentration: Math.round(concentration * 100), potentialReturn: Math.round(potentialReturn), invested, reserve, avgOdds: avgOdds.toFixed(2) };
}

function Feedback({ user, bets, feedback, score, onContinue }) {
  const { mobile } = useR();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: mobile ? "32px 16px 60px" : "48px 24px 80px" }}>
      <ProgressBar step={3} />

      <h2 style={{ fontFamily: F.display, fontSize: mobile ? 32 : 60, lineHeight: 0.95, color: C.white, marginTop: 24, marginBottom: 36, letterSpacing: "0.005em" }}>
        LO QUE TU PORTAFOLIO<br />DICE DE TI
      </h2>

      {/* Andrés card */}
      <div style={{
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.limeFaint} 100%)`,
        border: `1px solid rgba(200,241,53,0.3)`,
        borderRadius: 4, padding: 32, marginBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.lime})`, marginTop: -32, marginLeft: -32, marginRight: -32, marginBottom: 24 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <AvatarAB size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.cond, fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: "0.05em" }}>ANDRÉS BILBAO · AI</div>
            <div style={{ fontSize: 11, color: C.lime, display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime }} />
              Acaba de revisar tus apuestas
            </div>
          </div>
          <div style={{
            fontFamily: F.cond, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
            background: C.limeFaint, border: `1px solid rgba(200,241,53,0.3)`,
            color: C.lime, padding: "4px 10px", borderRadius: 100, textTransform: "uppercase",
          }}>BETA</div>
        </div>
        <div style={{ fontSize: 16, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
          {feedback}
        </div>
      </div>

      {/* Score breakdown */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: C.lime, marginBottom: 14, textTransform: "uppercase" }}>
          ▼ MÉTRICAS DE TU ESTRATEGIA
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 2, background: C.border }}>
          <ScoreCard label="SCORE" value={`$${score?.value?.toLocaleString() || 0}`} sub="Retorno ajustado" highlight color={C.lime} />
          <ScoreCard label="RIESGO" value={score?.risk || "—"} sub={`Odds prom. ${score?.avgOdds}x`} color={score?.risk === "Alto" ? C.red : score?.risk === "Medio" ? C.gold : C.mint} />
          <ScoreCard label="DIVERSIF." value={`${score?.diversification || 0}/8`} sub="Partidos" color={C.white} />
          <ScoreCard label="CONC." value={`${score?.concentration || 0}%`} sub="Apuesta + grande" color={C.white} />
        </div>
      </div>

      {/* Bets list */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 20, marginBottom: 32 }}>
        <div style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: C.mid, marginBottom: 14, textTransform: "uppercase" }}>TU PORTAFOLIO</div>
        {Object.entries(bets).filter(([, b]) => b?.pick && b?.amount > 0).map(([id, b]) => {
          const m = MATCHES.find(x => x.id === parseInt(id));
          const winner = b.pick === "home" ? m.home : b.pick === "away" ? m.away : { n: "Empate", f: "🤝" };
          return (
            <div key={id} style={{
              display: "grid", gridTemplateColumns: mobile ? "auto 1fr auto" : "auto 1fr auto auto auto",
              gap: 14, alignItems: "center", padding: "10px 0",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", gap: 4, fontSize: 18 }}>
                <span>{m.home.f}</span><span style={{ color: C.muted }}>·</span><span>{m.away.f}</span>
              </div>
              <div style={{ fontFamily: F.cond, fontSize: 13, fontWeight: 600, color: C.white, letterSpacing: "0.02em" }}>
                {m.home.code} VS {m.away.code}
              </div>
              <div style={{ fontFamily: F.cond, fontSize: 12, color: C.lime, fontWeight: 700, letterSpacing: "0.05em" }}>{winner.f} {winner.n.toUpperCase()}</div>
              <div style={{ fontFamily: F.mono, fontSize: 13, color: C.white }}>${b.amount.toLocaleString()}</div>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.gold }}>{m.odds[b.pick].toFixed(1)}x</div>
            </div>
          );
        })}
      </div>

      <button onClick={onContinue} style={{ ...btnPrimary, width: "100%", padding: "16px 24px", justifyContent: "center" }}>
        <span>VER EL RANKING</span>
        <span style={{ fontSize: 16 }}>→</span>
      </button>
    </div>
  );
}

function ScoreCard({ label, value, sub, highlight, color }) {
  return (
    <div style={{
      background: highlight ? `linear-gradient(135deg, ${C.surface}, ${C.limeFaint})` : C.surface,
      padding: 20,
    }}>
      <div style={{ fontFamily: F.cond, fontSize: 10, letterSpacing: "0.18em", color: C.mid, marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: F.display, fontSize: 32, color: color || C.white, lineHeight: 1, letterSpacing: "0.005em" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW · LEADERBOARD
═══════════════════════════════════════════════════════ */
function Board({ board, user, score }) {
  const { mobile } = useR();
  const userEntry = {
    name: user.name.split(" ")[0] + " (Tú)",
    company: user.company, stage: user.stage,
    score: score.value, risk: score.risk, div: score.diversification, isUser: true,
  };
  const fullBoard = [...board.filter(b => !b.isUser), userEntry].sort((a, b) => b.score - a.score);
  const userRank = fullBoard.findIndex(e => e.isUser) + 1;

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: mobile ? "32px 16px 60px" : "48px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <FlagDot color={C.gold} />
        <span style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: C.gold, textTransform: "uppercase" }}>
          TABLA DE POSICIONES
        </span>
      </div>

      <h2 style={{ fontFamily: F.display, fontSize: mobile ? 36 : 64, lineHeight: 0.92, color: C.white, marginBottom: 8, letterSpacing: "0.005em" }}>
        QUEDASTE #{userRank} <span style={{ color: C.lime }}>DE {fullBoard.length}</span>
      </h2>
      <p style={{ fontSize: 14, color: C.text, marginBottom: 32, lineHeight: 1.65 }}>
        El ranking se actualiza con cada partido real. Al final del Mundial: top 3 entra al inmersivo con beca completa.
      </p>

      {/* Table */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.gold}, ${C.lime}, ${C.mint})` }} />

        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: mobile ? "40px 1fr 1fr" : "60px 1fr 1.2fr 100px 100px 1fr",
          gap: mobile ? 10 : 14, padding: mobile ? "10px 14px" : "12px 20px", background: C.surfaceHi,
          fontFamily: F.cond, fontSize: 10, letterSpacing: "0.18em",
          textTransform: "uppercase", color: C.mid, fontWeight: 700,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div>POS</div>
          <div>FOUNDER</div>
          <div>EMPRESA</div>
          <div>RIESGO</div>
          <div>DIV.</div>
          <div style={{ textAlign: "right" }}>SCORE</div>
        </div>

        {/* Rows */}
        {fullBoard.map((e, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: mobile ? "40px 1fr 1fr" : "60px 1fr 1.2fr 100px 100px 1fr",
            gap: mobile ? 10 : 14, padding: mobile ? "10px 14px" : "14px 20px",
            borderBottom: i < fullBoard.length - 1 ? `1px solid ${C.border}` : "none",
            background: e.isUser ? C.limeFaint : "transparent",
            alignItems: "center",
            position: "relative",
          }}>
            {e.isUser && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.lime }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: F.display, fontSize: 22,
                color: i === 0 ? C.gold : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : C.muted,
                letterSpacing: "0.005em",
              }}>
                {i + 1}
              </span>
              {i < 3 && <span style={{ fontSize: 16 }}>🏆</span>}
            </div>
            <div style={{ fontFamily: F.cond, fontSize: 14, fontWeight: 600, color: e.isUser ? C.lime : C.white, letterSpacing: "0.02em" }}>
              {e.name.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.text }}>{e.company}</div>
              <div style={{ fontFamily: F.cond, fontSize: 10, color: C.mid, marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>{e.stage}</div>
            </div>
            <div>
              <span style={{
                fontFamily: F.cond, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 3,
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: e.risk === "Alto" ? "rgba(230,57,70,0.15)" : e.risk === "Medio" ? "rgba(255,182,39,0.15)" : "rgba(132,220,198,0.15)",
                color: e.risk === "Alto" ? C.red : e.risk === "Medio" ? C.gold : C.mint,
                border: `1px solid ${e.risk === "Alto" ? "rgba(230,57,70,0.4)" : e.risk === "Medio" ? "rgba(255,182,39,0.4)" : "rgba(132,220,198,0.4)"}`,
              }}>{e.risk}</span>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text }}>{e.div}/8</div>
            <div style={{ textAlign: "right", fontFamily: F.display, fontWeight: 400, fontSize: 22, color: e.isUser ? C.lime : C.white, letterSpacing: "0.005em" }}>
              ${e.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div style={{
        marginTop: 48, padding: "56px 32px", textAlign: "center", position: "relative",
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.limeFaint} 100%)`,
        border: `1px solid rgba(200,241,53,0.25)`,
        borderRadius: 4, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          fontFamily: F.display, fontSize: 220, color: "rgba(200,241,53,0.04)",
          lineHeight: 1, pointerEvents: "none",
        }}>30X</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h3 style={{ fontFamily: F.display, fontSize: mobile ? 28 : 48, color: C.white, marginBottom: 14, letterSpacing: "0.005em", lineHeight: 0.95 }}>
            ¿NO QUIERES ESPERAR<br />AL FINAL DEL MUNDIAL?
          </h3>
          <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 28, maxWidth: 460, margin: "0 auto 28px" }}>
            La próxima inmersión presencial es en junio. Bogotá y Caracas. Aplica directo.
          </p>
          <button style={btnPrimary}>
            <span>APLICAR AL INMERSIVO 30X</span>
            <span style={{ fontSize: 16 }}>→</span>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: C.mid }}>
        Comparte tu posición:{" "}
        <button style={shareBtn}>LinkedIn</button>{" · "}
        <button style={shareBtn}>WhatsApp</button>{" · "}
        <button style={shareBtn}>Instagram</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ATOMS / STYLES
═══════════════════════════════════════════════════════ */
function AvatarAB({ size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      overflow: "hidden",
      border: `2px solid ${C.lime}`,
      boxShadow: `0 0 ${size * 0.3}px rgba(200,241,53,0.2)`,
    }}>
      <img
        src="/andres.png"
        alt="Andrés Bilbao"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.style.background = `linear-gradient(135deg, ${C.lime}, #6a9000)`;
          e.target.parentElement.style.display = "flex";
          e.target.parentElement.style.alignItems = "center";
          e.target.parentElement.style.justifyContent = "center";
          e.target.parentElement.innerHTML = `<span style="font-family:${F.display};font-size:${size * 0.42}px;color:${C.bg}">AB</span>`;
        }}
      />
    </div>
  );
}

function SectionHeader({ n, label, title }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 1, background: C.lime }} />
        <span style={{ fontFamily: F.cond, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: C.lime, textTransform: "uppercase" }}>
          {n && <span style={{ opacity: 0.5 }}>{n} / </span>}{label}
        </span>
      </div>
      {title && (
        <h2 style={{ fontFamily: F.display, fontSize: 56, lineHeight: 0.95, color: C.white, marginTop: 14, letterSpacing: "0.005em" }}>
          {title}
        </h2>
      )}
    </div>
  );
}

const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: 10,
  background: C.lime, color: C.bg, border: "none",
  fontFamily: F.cond, fontWeight: 700, fontSize: 14, letterSpacing: "0.12em",
  padding: "14px 28px", cursor: "pointer", borderRadius: 3,
  textTransform: "uppercase",
};

const shareBtn = {
  background: "none", border: "none", color: C.lime, cursor: "pointer",
  textDecoration: "underline", fontFamily: F.body, fontSize: 13,
};

const fieldLabel = {
  display: "block", fontFamily: F.cond, fontSize: 11,
  color: C.mid, marginBottom: 6, letterSpacing: "0.15em",
  textTransform: "uppercase", fontWeight: 600,
};

const fieldInput = {
  width: "100%", background: C.surface, border: `1px solid ${C.border}`,
  color: C.white, padding: "12px 14px", fontSize: 14, borderRadius: 3,
  outline: "none", fontFamily: F.body,
};

/* ────── FOOTER ──────────────────────────────────────────── */
function Footer() {
  const { mobile } = useR();
  return (
    <div style={{
      padding: "32px 24px", borderTop: `1px solid ${C.border}`,
      marginTop: 80, background: C.bgDeep, position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: F.display, fontSize: 18, letterSpacing: "0.02em" }}>
            3<span style={{ color: C.lime }}>0X</span>
          </span>
          <span style={{ fontFamily: F.cond, fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            MUNDIAL DEL CEO · Propuesta de Daniel para Andrés Bilbao
          </span>
        </div>
        <div style={{ fontFamily: F.cond, fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Prototipo funcional · 2026
        </div>
      </div>
    </div>
  );
}

/* ────── GLOBAL ANIMATIONS ──────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      @keyframes ping { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.3);opacity:0} }
    `}</style>
  );
}
