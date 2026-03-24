"use client"
import { useState, useEffect, useRef } from "react";

// ── Tailwind config is loaded globally in index.html ──────────────────────
// This file assumes Tailwind CDN + Google Fonts are available (see wrapper HTML)

// ── COLOR TOKENS ──────────────────────────────────────────────────────────
const C = {
  surface: "#0f1419",
  surfaceContainerLowest: "#0a0f14",
  surfaceContainerLow: "#171c22",
  surfaceContainer: "#1b2026",
  surfaceContainerHigh: "#252a30",
  surfaceContainerHighest: "#30353b",
  surfaceBright: "#353a40",
  onSurface: "#dee3eb",
  onSurfaceVariant: "#c2c6d6",
  primary: "#adc6ff",
  primaryFixedDim: "#adc6ff",
  onPrimary: "#002e69",
  tertiary: "#31e192",
  secondary: "#a2e7ff",
  outline: "#8c909f",
  outlineVariant: "#424753",
  error: "#ffb4ab",
};

// ── SHARED STYLES ──────────────────────────────────────────────────────────
const monoFont = "'ui-monospace', 'Cascadia Code', 'Source Code Pro', monospace";
const headFont = "'Space Grotesk', sans-serif";
const bodyFont = "'Inter', sans-serif";

// ── GLOBAL CSS (injected once) ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${C.surface};
      color: ${C.onSurface};
      font-family: ${bodyFont};
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: rgba(173,198,255,0.25); }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      font-size: 20px;
      display: inline-flex;
      align-items: center;
      user-select: none;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.surfaceContainerLowest}; }
    ::-webkit-scrollbar-thumb { background: ${C.outlineVariant}; border-radius: 2px; }

    /* Code grid bg */
    .code-grid {
      background-image: radial-gradient(circle at 2px 2px, ${C.surfaceContainer} 1px, transparent 0);
      background-size: 40px 40px;
    }

    /* Glow blobs */
    .blob-primary {
      position: absolute;
      border-radius: 50%;
      background: rgba(173,198,255,0.07);
      filter: blur(100px);
      pointer-events: none;
    }
    .blob-tertiary {
      position: absolute;
      border-radius: 50%;
      background: rgba(49,225,146,0.05);
      filter: blur(80px);
      pointer-events: none;
    }

    /* Ping animation */
    @keyframes ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    .animate-ping {
      animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

    /* Fade in on mount */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-up-d1 { animation: fadeUp 0.6s 0.1s ease both; }
    .fade-up-d2 { animation: fadeUp 0.6s 0.2s ease both; }
    .fade-up-d3 { animation: fadeUp 0.6s 0.3s ease both; }
    .fade-up-d4 { animation: fadeUp 0.6s 0.4s ease both; }
    .fade-up-d5 { animation: fadeUp 0.6s 0.5s ease both; }

    /* Glass nav */
    .glass-nav {
      background: rgba(15,20,25,0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    /* Input reset */
    input, textarea {
      outline: none;
      font-family: ${bodyFont};
    }
    input:focus, textarea:focus {
      box-shadow: 0 0 0 2px rgba(173,198,255,0.4);
    }

    /* Skill bar */
    @keyframes barGrow {
      from { width: 0; }
    }
    .skill-bar { animation: barGrow 1s ease forwards; }

    /* Terminal blink */
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .cursor-blink { animation: blink 1s step-end infinite; }

    /* Tag pill */
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-family: ${monoFont};
      letter-spacing: 0.05em;
      border: 1px solid rgba(173,198,255,0.15);
      color: ${C.onSurfaceVariant};
      background: rgba(173,198,255,0.06);
    }

    /* Transition helpers */
    .transition-fast { transition: all 0.15s ease; }
    .transition-med  { transition: all 0.3s ease; }

    /* Status dot */
    .status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: ${C.tertiary};
      position: relative;
    }
    .status-dot::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: ${C.tertiary};
      animation: ping 1s cubic-bezier(0,0,0.2,1) infinite;
    }
  `}</style>
);

// ── ICON ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>
    {name}
  </span>
);

// ── TOP NAV ───────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Projects", "Skills", "Contact"];

const TopNav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="glass-nav"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: scrolled ? `1px solid rgba(66,71,83,0.3)` : "1px solid transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 72,
      }}>
        {/* Logo */}
        <button
          onClick={() => setPage("Home")}
          style={{
            fontFamily: headFont, fontWeight: 900, fontSize: 20,
            letterSpacing: "-0.04em", color: "#f1f5f9", background: "none",
            border: "none", cursor: "pointer",
          }}
        >
          THE_ARCHITECT
        </button>

        {/* Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => setPage(link)}
              style={{
                fontFamily: headFont, fontWeight: 700, fontSize: 13,
                letterSpacing: "-0.01em",
                color: page === link ? C.primary : C.outline,
                background: "none", border: "none", cursor: "pointer",
                borderBottom: page === link ? `2px solid ${C.primary}` : "2px solid transparent",
                paddingBottom: 4,
                transition: "all 0.2s ease",
              }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div style={{ display: "flex", gap: 8 }}>
          {["terminal", "code"].map(ic => (
            <button key={ic} style={{
              padding: 8, borderRadius: 8, background: "none", border: "none",
              color: C.primary, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(173,198,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <Icon name={ic} size={20} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ── SIDE NAV ──────────────────────────────────────────────────────────────
const SIDE_ITEMS = [
  { icon: "dashboard", label: "Overview", page: "Home" },
  { icon: "source", label: "Source", page: "Projects" },
  { icon: "account_tree", label: "Architecture", page: "Skills" },
  { icon: "rocket_launch", label: "Deployment", page: "Contact" },
];

const SideNav = ({ page, setPage }) => (
  <aside style={{
    position: "fixed", left: 0, top: 0, width: 220, height: "100vh",
    background: `linear-gradient(to right, ${C.surfaceContainerLow}, ${C.surface})`,
    display: "flex", flexDirection: "column", paddingTop: 88, paddingBottom: 32,
    fontFamily: monoFont, fontSize: 13, zIndex: 40,
    borderRight: `1px solid rgba(66,71,83,0.15)`,
  }}>
    <div style={{ padding: "0 28px", marginBottom: 40 }}>
      <div style={{ fontWeight: 700, color: C.tertiary, fontSize: 15 }}>System.root</div>
      <div style={{ color: C.outline, fontSize: 11, marginTop: 4 }}>v2.4.0-stable</div>
    </div>

    <nav style={{ flex: 1 }}>
      {SIDE_ITEMS.map(({ icon, label, page: p }) => {
        const active = page === p;
        return (
          <button key={label} onClick={() => setPage(p)} style={{
            display: "flex", alignItems: "center", gap: 12,
            width: "100%", padding: "12px 24px",
            background: active ? "rgba(49,225,146,0.08)" : "none",
            borderTop: "none", borderBottom: "none", borderLeft: "none",
            borderRight: active ? `2px solid ${C.tertiary}` : "2px solid transparent",
            color: active ? C.tertiary : C.outline,
            cursor: "pointer", textAlign: "left",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = C.onSurface; e.currentTarget.style.background = C.surfaceBright + "40"; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = C.outline; e.currentTarget.style.background = "none"; } }}
          >
            <Icon name={icon} size={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>

    <div style={{ padding: "0 20px", marginTop: "auto" }}>
    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
      <button style={{
        width: "100%", padding: "8px 0",
        background: "rgba(49,225,146,0.08)",
        border: `1px solid rgba(49,225,146,0.2)`,
        borderRadius: 8, color: C.tertiary,
        fontFamily: monoFont, fontSize: 11, fontWeight: 700,
        cursor: "pointer", letterSpacing: "0.05em",
        transition: "all 0.2s ease",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(49,225,146,0.15)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(49,225,146,0.08)"}
        
      >
        View Resume
      </button>
      </a>
    </div>
  </aside>
);

// ── FOOTER ────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    background: C.surface, borderTop: `1px solid rgba(30,41,59,0.5)`,
    padding: "40px 32px",
  }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      maxWidth: 1280, margin: "0 auto", flexWrap: "wrap", gap: 16,
    }}>
      <span style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: "0.15em", color: "#475569", textTransform: "uppercase" }}>
        © 2024 DIGITAL_ARCHITECT. Engineered with intent.
      </span>
      <div style={{ display: "flex", gap: 32 }}>
        {["GitHub", "LinkedIn", "Twitter"].map(l => (
          <a key={l} href="#" style={{
            fontFamily: monoFont, fontSize: 10, letterSpacing: "0.15em",
            color: "#475569", textDecoration: "none", textTransform: "uppercase",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = C.tertiary}
            onMouseLeave={e => e.currentTarget.style.color = "#475569"}
          >{l}</a>
        ))}
      </div>
    </div>
  </footer>
);

// ══════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ══════════════════════════════════════════════════════════════════════════
const HomePage = ({ setPage }) => (
  <div>
    {/* Hero */}
    <section className="code-grid" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "0 64px", position: "relative", overflow: "hidden",
    }}>
      <div className="blob-primary" style={{ width: 400, height: 400, top: "20%", right: -80 }} />
      <div className="blob-tertiary" style={{ width: 320, height: 320, bottom: "20%", left: -60 }} />

      <div style={{
        maxWidth: 1280, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "7fr 5fr",
        gap: 64, alignItems: "center", position: "relative", zIndex: 1,
      }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Status badge */}
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px",
            background: C.surfaceContainerHigh,
            border: `1px solid rgba(66,71,83,0.2)`,
            borderRadius: 999, width: "fit-content",
          }}>
            <span className="status-dot" />
            <span style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: "0.2em", color: C.tertiary, textTransform: "uppercase" }}>
              System Status: Operational
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up-d1" style={{
            fontFamily: headFont, fontSize: "clamp(48px, 6vw, 80px)",
            fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
            color: C.onSurface,
          }}>
            Building{" "}
            <span style={{ color: C.primaryFixedDim }}>Digital</span>{" "}
            Experiences with{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>Precision.</em>
          </h1>

          <p className="fade-up-d2" style={{
            fontSize: 18, color: C.onSurfaceVariant, maxWidth: 480, lineHeight: 1.7,
          }}>
            Full-stack developer specializing in architecting scalable applications and crafting
            high-fidelity user interfaces. Turning complex logic into seamless human experiences.
          </p>

          {/* CTAs */}
          <div className="fade-up-d3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => setPage("Projects")}
              style={{
                padding: "14px 28px", borderRadius: 8,
                background: C.primary, color: C.onPrimary,
                fontFamily: headFont, fontWeight: 700, fontSize: 15,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: `0 8px 32px rgba(173,198,255,0.2)`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(173,198,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(173,198,255,0.2)"; }}
            >
              View Projects <Icon name="arrow_forward" size={18} />
            </button>
            <button style={{
              padding: "14px 28px", borderRadius: 8,
              background: "rgba(48,53,59,0.2)",
              color: C.primary,
              border: `1px solid rgba(173,198,255,0.2)`,
              fontFamily: headFont, fontWeight: 700, fontSize: 15,
              cursor: "pointer", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(48,53,59,0.4)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(48,53,59,0.2)"}
            >
              View Source
            </button>
          </div>

          {/* Tech stack */}
          <div className="fade-up-d4" style={{ display: "flex", alignItems: "center", gap: 24, paddingTop: 16 }}>
            <span style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: "0.2em", color: "#475569", textTransform: "uppercase" }}>
              Core Stack
            </span>
            <div style={{ display: "flex", gap: 16, opacity: 0.5, filter: "grayscale(1)", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "none"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.filter = "grayscale(1)"; }}
            >
              {["data_object", "deployed_code", "javascript", "terminal", "database"].map(ic => (
                <Icon key={ic} name={ic} size={28} style={{ color: C.onSurface }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — Portrait */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative", aspectRatio: "1/1", maxWidth: 420, margin: "0 auto" }}>
            {/* Main image */}
            <div style={{
              borderRadius: 16, overflow: "hidden",
              background: C.surfaceContainerLow,
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}>
              <img
                src="https://res.cloudinary.com/di2chvoq9/image/upload/v1774358048/IMG_20240921_142339_bqr3uu.jpg"
                alt="Developer Portrait"
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", mixBlendMode: "luminosity", transition: "mix-blend-mode 0.7s" }}
                onMouseEnter={e => e.target.style.mixBlendMode = "normal"}
                onMouseLeave={e => e.target.style.mixBlendMode = "luminosity"}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to top, ${C.surface} 0%, transparent 60%)`,
                opacity: 0.6, pointerEvents: "none",
              }} />
            </div>

            {/* Floating commit card */}
            <div style={{
              position: "absolute", bottom: -24, left: -40,
              background: "rgba(48,53,59,0.65)",
              backdropFilter: "blur(16px)",
              border: `1px solid rgba(66,71,83,0.2)`,
              borderRadius: 12, padding: 20,
              boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
              minWidth: 220,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(49,225,146,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="commit" size={16} style={{ color: C.tertiary }} />
                </div>
                <div>
                  <div style={{ fontFamily: monoFont, fontSize: 9, color: C.outline, textTransform: "uppercase", letterSpacing: "0.1em" }}>Latest Commit</div>
                  <div style={{ fontFamily: headFont, fontSize: 12, fontWeight: 700, color: C.onSurface, marginTop: 2 }}>feat: engine.v2</div>
                </div>
              </div>
              <div style={{ background: C.surfaceContainerHigh, borderRadius: 999, height: 4, overflow: "hidden" }}>
                <div style={{ width: "75%", height: "100%", background: C.tertiary, borderRadius: 999 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: monoFont, fontSize: 8, color: C.outline }}>
                <span>BUILDING</span><span>75%</span>
              </div>
            </div>

            {/* Decorative offset border */}
            <div style={{
              position: "absolute", inset: 0,
              border: `2px solid rgba(173,198,255,0.15)`,
              borderRadius: 16,
              transform: "translate(16px, 16px)",
              zIndex: -1,
            }} />
          </div>
        </div>
      </div>
    </section>

    {/* Editorial section break */}
    <section style={{ padding: "80px 64px", borderTop: `1px solid rgba(66,71,83,0.1)` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {[
            { num: "01", label: "Clean Logic", title: "Readable & Maintainable", desc: "Prioritizing code quality and architectural integrity above all. Scalability isn't an afterthought; it's the foundation." },
            { num: "02", label: "Human Design", title: "Intuitive Interfaces", desc: "Bridging the gap between back-end complexity and front-end simplicity. Design that feels like second nature." },
            { num: "03", label: "Rapid Delivery", title: "Optimized Pipelines", desc: "Leveraging modern CI/CD practices to ensure stable, fast, and secure deployments across any environment." },
          ].map(({ num, label, title, desc }) => (
            <div key={num} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontFamily: monoFont, fontSize: 10, color: C.primary, textTransform: "uppercase", letterSpacing: "0.3em" }}>
                {num}. {label}
              </span>
              <h3 style={{ fontFamily: headFont, fontSize: 20, fontWeight: 700, color: C.onSurface }}>{title}</h3>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════
// PAGE: PROJECTS
// ══════════════════════════════════════════════════════════════════════════
const PROJECTS = [
  {
    id: "neural_dash",
    name: "NEURAL_DASH",
    desc: "A high-performance visualization engine for neural network training cycles. Real-time telemetry processed via WebWorkers.",
    tags: ["REACT", "WEBGL", "D3JS"],
    status: "LIVE SYSTEM",
    statusColor: C.tertiary,
    size: "large",
    hasImage: true,
    links: ["LIVE_DEMO", "SOURCE"],
  },
  {
    id: "synapse_os",
    name: "SYNAPSE_OS",
    desc: "Micro-kernel architecture experiment focusing on memory safety and asynchronous task scheduling.",
    tags: ["RUST", "X86_64", "WASM"],
    status: null,
    size: "medium",
    links: ["VIEW_REPO"],
  },
  {
    id: "kv_core",
    name: "KV_CORE",
    desc: "A distributed key-value store with eventual consistency and high-availability clusters.",
    tags: ["GO", "GRPC", "DOCKER"],
    status: null,
    size: "medium",
    links: ["VIEW_REPO"],
  },
  {
    id: "crypto_vault",
    name: "CRYPTO_VAULT",
    desc: "End-to-end encrypted storage solution utilizing AES-256-GCM. Designed for security-first environments where zero-knowledge architecture is mandatory.",
    tags: [],
    status: null,
    size: "large",
    metrics: [
      { key: "STATUS", value: "STABLE_PRODUCTION", color: C.tertiary },
      { key: "COVERAGE", value: "98.4%_UNIT_TESTS", color: C.onSurfaceVariant },
      { key: "LICENSE", value: "MIT_OPEN_SOURCE", color: C.onSurfaceVariant },
    ],
    links: [],
  },
];

const FILTER_TABS = ["ALL_FILES", "TYPESCRIPT", "RUST", "SYSTEM_CORE"];

const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.surfaceBright : C.surfaceContainerLow,
        borderRadius: 12,
        padding: 28,
        transition: "background 0.3s ease",
        display: "flex", flexDirection: "column", gap: 16,
        border: `1px solid rgba(66,71,83,0.1)`,
        cursor: "default",
      }}
    >
      {project.status && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="status-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontFamily: monoFont, fontSize: 9, color: C.tertiary, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {project.status}
          </span>
        </div>
      )}

      {project.id === "synapse_os" && (
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: C.surfaceContainerHigh,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="grid_view" size={20} style={{ color: C.onSurfaceVariant }} />
        </div>
      )}

      {project.id === "kv_core" && (
        <div style={{ color: C.onSurfaceVariant }}>
          <Icon name="storage" size={28} />
        </div>
      )}

      <div>
        <h3 style={{
          fontFamily: headFont, fontWeight: 800, fontSize: 22,
          letterSpacing: "-0.02em", color: C.onSurface, marginBottom: 10,
        }}>
          {project.name}
        </h3>
        <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.65 }}>{project.desc}</p>
      </div>

      {project.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      )}

      {project.metrics && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {project.metrics.map(({ key, value, color }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, textTransform: "uppercase" }}>{key}</span>
              <span style={{ fontFamily: monoFont, fontSize: 11, color, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {project.links?.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {project.links.map((l, i) => (
            <button key={l} style={{
              padding: "8px 16px", borderRadius: 6,
              background: i === 0 ? C.onSurface : "transparent",
              color: i === 0 ? C.surface : C.onSurfaceVariant,
              border: i === 0 ? "none" : `1px solid rgba(66,71,83,0.4)`,
              fontFamily: monoFont, fontSize: 10, fontWeight: 600,
              letterSpacing: "0.08em", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s ease",
            }}>
              {i === 0 && <Icon name="launch" size={12} />}
              {l}
            </button>
          ))}
        </div>
      )}

      {(project.id === "synapse_os" || project.id === "kv_core") && (
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, letterSpacing: "0.1em" }}>VIEW_REPO</span>
          <Icon name="open_in_new" size={16} style={{ color: C.outline }} />
        </div>
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState("ALL_FILES");

  return (
    <div>
      <section style={{ padding: "80px 64px 60px", maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: monoFont, fontSize: 10, color: C.tertiary, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
            DEPLOYMENT ARCHIVE
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <h1 style={{
              fontFamily: headFont, fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", color: C.onSurface,
            }}>
              Featured<br />
              <span style={{ color: C.primaryFixedDim }}>Systems.</span>
            </h1>
            <p style={{ maxWidth: 340, fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.7 }}>
              A curated selection of architectural experiments and production-ready applications, built with a focus on performance, scalability, and code integrity.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {FILTER_TABS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "7px 16px", borderRadius: 6,
              background: activeFilter === f ? C.primary : C.surfaceContainerHigh,
              color: activeFilter === f ? C.onPrimary : C.onSurfaceVariant,
              border: "none", fontFamily: monoFont, fontSize: 10,
              letterSpacing: "0.1em", cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, gridAutoRows: "auto" }}>
          {/* NEURAL_DASH — spans 2 cols */}
          <div style={{ gridColumn: "span 1" }}>
            <ProjectCard project={PROJECTS[0]} />
          </div>
          {/* NEURAL_DASH image preview */}
          <div style={{
            gridColumn: "span 1",
            borderRadius: 12,
            overflow: "hidden",
            background: C.surfaceContainerLowest,
            border: `1px solid rgba(66,71,83,0.1)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: 240,
          }}>
            <div style={{
              width: "85%", height: "60%",
              background: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(49,225,146,0.06) 4px, rgba(49,225,146,0.06) 5px)`,
              borderRadius: 4, position: "relative",
            }}>
              {/* Fake waveform bars */}
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline points="0,50 30,20 60,70 90,30 120,60 150,10 180,55 210,25 240,65 270,35 300,50"
                  fill="none" stroke="rgba(49,225,146,0.4)" strokeWidth="2" />
                <polyline points="0,60 30,40 60,80 90,45 120,70 150,30 180,65 210,40 240,72 270,48 300,60"
                  fill="none" stroke="rgba(173,198,255,0.2)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          {/* SYNAPSE_OS */}
          <div style={{ gridColumn: "span 1" }}>
            <ProjectCard project={PROJECTS[1]} />
          </div>

          {/* Row 2 */}
          <div style={{ gridColumn: "span 1" }}>
            <ProjectCard project={PROJECTS[2]} />
          </div>
          {/* CRYPTO_VAULT — spans 2 */}
          <div style={{ gridColumn: "span 2" }}>
            {/* Terminal-style card */}
            <div style={{
              background: C.surfaceContainerLow,
              borderRadius: 12, overflow: "hidden",
              border: `1px solid rgba(66,71,83,0.1)`,
              height: "100%",
            }}>
              {/* Window chrome */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "12px 20px",
                background: C.surfaceContainerHigh,
                borderBottom: `1px solid rgba(66,71,83,0.15)`,
              }}>
                {[C.error + "60", C.secondary + "60", C.tertiary + "60"].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <span style={{ marginLeft: 12, fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.15em" }}>
                  projects/crypto_vault.v2.sh
                </span>
              </div>
              <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
                <div>
                  <h3 style={{ fontFamily: headFont, fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em", color: C.onSurface, marginBottom: 14 }}>
                    CRYPTO_VAULT
                  </h3>
                  <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.7, marginBottom: 24 }}>
                    {PROJECTS[3].desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {PROJECTS[3].metrics.map(({ key, value, color }) => (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline }}>{key}</span>
                        <span style={{ fontFamily: monoFont, fontSize: 10, color, fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Shield icon */}
                <div style={{
                  background: "rgba(49,225,146,0.07)",
                  borderRadius: 12, aspectRatio: "1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid rgba(49,225,146,0.1)`,
                }}>
                  <Icon name="security" size={56} style={{ color: "rgba(49,225,146,0.4)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={{
        margin: "0 64px 80px",
        background: C.surfaceContainerLow,
        borderRadius: 16, padding: "72px 64px",
        textAlign: "center",
        border: `1px solid rgba(66,71,83,0.1)`,
      }}>
        <h2 style={{
          fontFamily: headFont, fontWeight: 900, fontSize: "clamp(32px, 5vw, 60px)",
          letterSpacing: "-0.03em", color: C.onSurface, marginBottom: 16,
          textTransform: "uppercase",
        }}>
          Have a System<br />
          <span style={{ color: C.primaryFixedDim }}>In Mind?</span>
        </h2>
        <p style={{ fontSize: 15, color: C.onSurfaceVariant, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          I am currently open to new architectural challenges and full-stack development opportunities. Let's build something robust.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            padding: "16px 32px", borderRadius: 8,
            background: C.onSurface, color: C.surface,
            fontFamily: monoFont, fontWeight: 700, fontSize: 12,
            letterSpacing: "0.1em", border: "none", cursor: "pointer",
            transition: "opacity 0.2s",
          }}>
            INITIATE_CONTACT
          </button>
          <button style={{
            padding: "16px 32px", borderRadius: 8,
            background: C.surfaceContainerHigh, color: C.onSurface,
            fontFamily: monoFont, fontWeight: 700, fontSize: 12,
            letterSpacing: "0.1em", border: `1px solid rgba(66,71,83,0.3)`, cursor: "pointer",
          }}>
            DOWNLOAD_RESUME.pdf
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PAGE: SKILLS
// ══════════════════════════════════════════════════════════════════════════
const SKILL_CATEGORIES = [
  {
    title: "Frontend Development",
    icon: "layers",
    skills: [
      { name: "React / Next.js", pct: 95 },
      { name: "Tailwind CSS / SCSS", pct: 90 },
      { name: "TypeScript", pct: 92 },
    ],
  },
  {
    title: "Backend Systems",
    icon: "storage",
    skills: [
      { name: "Node.js / Express", pct: 88 },
      { name: "PostgreSQL / Redis", pct: 85 },
      { name: "GraphQL / REST", pct: 94 },
    ],
  },
  {
    title: "Operations & Tools",
    icon: "terminal",
    skills: [
      { name: "AWS / Google Cloud", pct: 82 },
      { name: "Docker / Kubernetes", pct: 78 },
      { name: "CI/CD / GitOps", pct: 90 },
    ],
  },
];

const SPECIALIZED = [
  { icon: "javascript", label: "JavaScript" },
  { icon: "cloud", label: "Serverless" },
  { icon: "lock", label: "Auth/IAM" },
  { icon: "monitoring", label: "Observability" },
  { icon: "auto_awesome", label: "Generative AI" },
  { icon: "grid_view", label: "Microservices" },
];

const TERMINAL_LINES = [
  { prompt: true, text: "list --workflow" },
  { prompt: false, text: "1. Requirements gathering & Analysis" },
  { prompt: false, text: "2. Architectural Blueprint & POC" },
  { prompt: false, text: "3. Scalable Implementation (TDD approach)" },
  { prompt: false, text: "4. Security Audit & Load Testing" },
  { prompt: false, text: "5. CI/CD Orchestration & Monitoring" },
  { prompt: false, text: "", status: "STATUS: READY_FOR_DEPLOYMENT" },
];

const SkillBar = ({ name, pct }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: C.onSurfaceVariant }}>{name}</span>
      <span style={{ fontFamily: monoFont, fontSize: 11, color: C.tertiary, fontWeight: 600 }}>{pct}%</span>
    </div>
    <div style={{ background: C.surfaceContainerHigh, borderRadius: 999, height: 3, overflow: "hidden" }}>
      <div className="skill-bar" style={{ width: `${pct}%`, height: "100%", background: C.tertiary, borderRadius: 999 }} />
    </div>
  </div>
);

const SkillsPage = () => {
  const terminalRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setVisibleLines(i);
          if (i >= TERMINAL_LINES.length) clearInterval(interval);
        }, 300);
      }
    }, { threshold: 0.3 });
    if (terminalRef.current) obs.observe(terminalRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      <section style={{ padding: "80px 64px", maxWidth: 1280, margin: "0 auto" }}>
        {/* Personal statement */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 64, alignItems: "start", marginBottom: 96 }}>
          <div>
            <span style={{ fontFamily: monoFont, fontSize: 10, color: C.secondary, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 20 }}>
              PERSONAL_STATEMENT
            </span>
            <h1 style={{
              fontFamily: headFont, fontSize: "clamp(40px, 5vw, 68px)",
              fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
              color: C.onSurface, marginBottom: 28,
            }}>
              Architecting<br />
              <span style={{ color: C.primaryFixedDim }}>Digital Resilience</span>
            </h1>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.8, maxWidth: 560, marginBottom: 20 }}>
              With over 8 years of engineering experience, I view code as a medium for building sustainable digital ecosystems. My approach merges the rigor of systems architecture with the fluid aesthetics of modern user interfaces.
            </p>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.8, maxWidth: 560 }}>
              I specialize in building scalable distributed systems and high-fidelity frontends that prioritize performance, security, and a relentless commitment to the user experience.
            </p>
          </div>
         
        </div>

        {/* Core Competencies */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                EXPERTISE_V2
              </span>
              <h2 style={{ fontFamily: headFont, fontSize: 28, fontWeight: 700, color: C.onSurface }}>Core Competencies</h2>
            </div>
            <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, letterSpacing: "0.15em" }}>TOTAL RESOURCES: 34 STACKS</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {SKILL_CATEGORIES.map(cat => (
              <div key={cat.title} style={{
                background: C.surfaceContainerLow,
                borderRadius: 12, padding: 28,
                border: `1px solid rgba(66,71,83,0.1)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: C.surfaceContainerHigh,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={cat.icon} size={18} style={{ color: C.tertiary }} />
                  </div>
                  <h3 style={{ fontFamily: headFont, fontWeight: 700, fontSize: 16, color: C.onSurface }}>{cat.title}</h3>
                </div>
                {cat.skills.map(s => <SkillBar key={s.name} {...s} />)}
              </div>
            ))}
          </div>
        </div>

        {/* Specialized stacks */}
        <div style={{ marginBottom: 80 }}>
          <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            TOOLBELT_EXTRA
          </span>
          <h2 style={{ fontFamily: headFont, fontSize: 28, fontWeight: 700, color: C.onSurface, marginBottom: 32 }}>Specialized Stacks</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {SPECIALIZED.map(({ icon, label }) => (
              <div key={label} style={{
                background: C.surfaceContainerLow, borderRadius: 10,
                padding: "20px 12px", textAlign: "center",
                border: `1px solid rgba(66,71,83,0.1)`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                transition: "all 0.2s ease", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surfaceContainerHigh; e.currentTarget.style.borderColor = "rgba(173,198,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.surfaceContainerLow; e.currentTarget.style.borderColor = "rgba(66,71,83,0.1)"; }}
              >
                <Icon name={icon} size={24} style={{ color: C.onSurfaceVariant }} />
                <span style={{ fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.05em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div ref={terminalRef} style={{
          background: C.surfaceContainerLowest,
          borderRadius: 12, overflow: "hidden",
          border: `1px solid rgba(66,71,83,0.15)`,
        }}>
          {/* Chrome */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "12px 20px",
            background: C.surfaceContainerHigh,
            borderBottom: `1px solid rgba(66,71,83,0.2)`,
          }}>
            {[C.error + "50", C.secondary + "50", C.tertiary + "50"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ marginLeft: 12, fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.15em" }}>
              CAPABILITIES.SH
            </span>
          </div>
          <div style={{ padding: "28px 32px", fontFamily: monoFont, fontSize: 13, lineHeight: 2 }}>
            {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {line.prompt ? (
                  <>
                    <span style={{ color: C.tertiary, flexShrink: 0 }}>guest@architect:~$</span>
                    <span style={{ color: C.onSurface }}>{line.text}</span>
                  </>
                ) : line.status ? (
                  <span style={{ color: C.tertiary, marginTop: 8 }}>{line.status}</span>
                ) : (
                  <span style={{ color: C.onSurfaceVariant, paddingLeft: 28 }}>{line.text}</span>
                )}
              </div>
            ))}
            {visibleLines > 0 && (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: C.tertiary }}>guest@architect:~$</span>
                <span className="cursor-blink" style={{ width: 8, height: 16, background: C.tertiary, display: "inline-block" }} />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ══════════════════════════════════════════════════════════════════════════
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div>
      <section style={{ padding: "80px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 64, alignItems: "start" }}>
          {/* Left info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <header>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 12px", borderRadius: 999,
                background: "rgba(49,225,146,0.1)",
                marginBottom: 20,
              }}>
                <span className="status-dot" />
                <span style={{ fontFamily: monoFont, fontSize: 9, color: C.tertiary, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Available for projects
                </span>
              </div>
              <h1 style={{
                fontFamily: headFont, fontSize: "clamp(44px, 6vw, 72px)",
                fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
                color: C.onSurface, marginBottom: 20,
              }}>
                Let's build<br />
                <span style={{ color: C.primaryFixedDim }}>together.</span>
              </h1>
              <p style={{ fontSize: 15, color: C.onSurfaceVariant, lineHeight: 1.75 }}>
                I specialize in architecting high-performance digital systems. Have a complex technical challenge? Let's discuss the implementation.
              </p>
            </header>

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "alternate_email", label: "Direct Channel", value: "hello@digital-architect.dev", color: C.primary },
                { icon: "location_on", label: "Base Operations", value: "Berlin, DE // Remote", color: C.secondary },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 20 }}
                  className="group"
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: C.surfaceContainerHigh,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color, transition: "all 0.3s ease", flexShrink: 0,
                  }}>
                    <Icon name={icon} size={20} style={{ color }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: monoFont, fontSize: 9, color: C.outline, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>{label}</p>
                    <p style={{ fontFamily: headFont, fontWeight: 600, fontSize: 15, color: C.onSurface }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p style={{ fontFamily: monoFont, fontSize: 9, color: C.outline, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
                Social Protocols
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { icon: "terminal", color: C.tertiary },
                  { icon: "share", color: C.primary },
                  { icon: "chat_bubble", color: C.secondary },
                ].map(({ icon, color }, i) => (
                  <a key={i} href="#" style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: C.surfaceContainerLow,
                    border: `1px solid rgba(66,71,83,0.2)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.onSurface, textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = C.surfaceContainerHigh; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.onSurface; e.currentTarget.style.background = C.surfaceContainerLow; }}
                  >
                    <Icon name={icon} size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: -4,
              background: "linear-gradient(135deg, rgba(173,198,255,0.15), rgba(49,225,146,0.08), rgba(162,231,255,0.12))",
              borderRadius: 16, filter: "blur(20px)", opacity: 0.6, pointerEvents: "none",
            }} />
            <div style={{
              position: "relative",
              background: C.surfaceContainerLow,
              borderRadius: 12, padding: 40,
              border: `1px solid rgba(66,71,83,0.1)`,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}>
              {/* Terminal chrome */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 36,
                paddingBottom: 20, borderBottom: `1px solid rgba(66,71,83,0.1)`,
              }}>
                {[C.error + "50", C.secondary + "50", C.tertiary + "50"].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <span style={{ marginLeft: 12, fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.2em" }}>
                  Transmission_Interface.sys
                </span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[
                    { id: "name", label: "Identity.name", placeholder: "John Doe", type: "text" },
                    { id: "email", label: "Identity.email", placeholder: "john@protocol.com", type: "email" },
                  ].map(({ id, label, placeholder, type }) => (
                    <div key={id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontFamily: monoFont, fontSize: 9, color: C.primary, textTransform: "uppercase", letterSpacing: "0.2em" }}>
                        {label}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[id]}
                        onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                        required
                        style={{
                          background: C.surfaceContainerLowest,
                          border: "none",
                          borderRadius: 10, padding: "14px 20px",
                          color: C.onSurface, fontSize: 14,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontFamily: monoFont, fontSize: 9, color: C.primary, textTransform: "uppercase", letterSpacing: "0.2em" }}>
                    Payload.message
                  </label>
                  <textarea
                    placeholder="Initialize transmission details..."
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                    style={{
                      background: C.surfaceContainerLowest,
                      border: "none", borderRadius: 10,
                      padding: "14px 20px", color: C.onSurface,
                      fontSize: 14, resize: "none",
                    }}
                  />
                </div>

                <button type="submit" style={{
                  padding: "18px 0", borderRadius: 10,
                  background: sent ? C.tertiary : C.primary,
                  color: sent ? "#002e69" : C.onPrimary,
                  fontFamily: headFont, fontWeight: 700, fontSize: 16,
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: `0 8px 24px rgba(173,198,255,0.15)`,
                  transition: "all 0.3s ease",
                }}>
                  {sent ? (
                    <><Icon name="check_circle" size={20} /> Transmission Sent!</>
                  ) : (
                    <><span>Execute Send Message</span><Icon name="send" size={20} /></>
                  )}
                </button>
              </form>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(48,53,59,0.3)", backdropFilter: "blur(8px)",
                padding: "10px 18px", borderRadius: 999,
                border: `1px solid rgba(66,71,83,0.1)`,
              }}>
                <Icon name="encrypted" size={14} style={{ color: C.tertiary }} />
                <span style={{ fontFamily: monoFont, fontSize: 9, color: C.onSurfaceVariant, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  E2E Encrypted Channel Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("Home");
  const mainRef = useRef(null);

  // Scroll to top on page change
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0 });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "Home":     return <HomePage setPage={setPage} />;
      case "Projects": return <ProjectsPage />;
      case "Skills":   return <SkillsPage />;
      case "Contact":  return <ContactPage />;
      default:         return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Side nav — only show on large screens via inline media check in component itself */}
        <SideNav page={page} setPage={setPage} />

        {/* Main content area */}
        <div style={{ flex: 1, marginLeft: 220 }} ref={mainRef}>
          <TopNav page={page} setPage={setPage} />
          <main style={{ paddingTop: 72 }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
