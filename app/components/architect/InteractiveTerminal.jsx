"use client";

import { useEffect, useRef, useState } from "react";
import { C, monoFont } from "./theme";
import Icon from "./Icon";

const BOOT_LINES = [
  { text: "SYSTEM BOOT v2.4.0", color: C.tertiary },
  { text: "Loading kernel modules... OK", color: C.outline },
  { text: "Initializing terminal... OK", color: C.outline },
  { text: "────────────────────────────────────────────", color: C.outlineVariant },
  { text: 'Type "help" for available commands', color: C.onSurfaceVariant },
  { text: "", color: "transparent" },
];

const COMMANDS = {
  help: () => [
    { text: "AVAILABLE COMMANDS:", color: C.tertiary, bold: true },
    { text: "", color: "transparent" },
    { text: "  help          Show this help message", color: C.onSurfaceVariant },
    { text: "  whoami        Display developer info", color: C.onSurfaceVariant },
    { text: "  skills        List technical skills", color: C.onSurfaceVariant },
    { text: "  projects      Show project archive", color: C.onSurfaceVariant },
    { text: "  contact       Display contact info", color: C.onSurfaceVariant },
    { text: "  resume        Download resume", color: C.onSurfaceVariant },
    { text: "  ls            List portfolio sections", color: C.onSurfaceVariant },
    { text: "  cat about.txt Show bio", color: C.onSurfaceVariant },
    { text: "  neofetch      System information", color: C.onSurfaceVariant },
    { text: "  date          Current date and time", color: C.onSurfaceVariant },
    { text: "  history       Show command history", color: C.onSurfaceVariant },
    { text: "  clear         Clear terminal", color: C.onSurfaceVariant },
    { text: "", color: "transparent" },
    { text: "SHORTCUTS:  ↑↓ history  Tab autocomplete  Esc clear input", color: C.outline },
  ],

  whoami: () => [
    { text: "┌─────────────────────────────────────────┐", color: C.outlineVariant },
    { text: "│  Ansh Singh                             │", color: C.primary, bold: true },
    { text: "│  Full Stack Developer                   │", color: C.onSurfaceVariant },
    { text: "│  India, Delhi // Remote                   │", color: C.onSurfaceVariant },
    { text: "│                                         │", color: C.outlineVariant },
    { text: "│  > Building scalable systems        │", color: C.tertiary },
    { text: "│  > Building high-fidelity UIs           │", color: C.tertiary },
    { text: "│  > 1.5+ years engineering experience    │", color: C.tertiary },
    { text: "└─────────────────────────────────────────┘", color: C.outlineVariant },
  ],

  skills: () => [
    { text: "CORE COMPETENCIES", color: C.tertiary, bold: true },
    { text: "", color: "transparent" },
    { text: "  Frontend Development", color: C.primary, bold: true },
    { text: "    React / Next.js       ████████████████████░ 95%", color: C.onSurfaceVariant },
    { text: "    Tailwind / SCSS       ██████████████████░░░ 90%", color: C.onSurfaceVariant },
    { text: "    TypeScript            ███████████████████░░ 92%", color: C.onSurfaceVariant },
    { text: "", color: "transparent" },
    { text: "  Backend Systems", color: C.primary, bold: true },
    { text: "    Node.js / Express     █████████████████░░░░ 88%", color: C.onSurfaceVariant },
    { text: "    PostgreSQL / Redis    █████████████████░░░░ 85%", color: C.onSurfaceVariant },
    { text: "    GraphQL / REST        ███████████████████░░ 94%", color: C.onSurfaceVariant },
    { text: "", color: "transparent" },
    { text: "  Operations & Tools", color: C.primary, bold: true },
    { text: "    AWS / Google Cloud    ████████████████░░░░░ 82%", color: C.onSurfaceVariant },
    { text: "    Docker / Kubernetes   ███████████████░░░░░░ 78%", color: C.onSurfaceVariant },
    { text: "    CI/CD / GitOps        ██████████████████░░░ 90%", color: C.onSurfaceVariant },
  ],

  projects: () => [
    { text: "DEPLOYMENT ARCHIVE", color: C.tertiary, bold: true },
    { text: "", color: "transparent" },
    { text: "  ◆ NEURAL_DASH", color: C.primary, bold: true },
    { text: "    High-performance neural network visualization engine", color: C.onSurfaceVariant },
    { text: "    Tags: REACT · WEBGL · D3JS  |  Status: LIVE_SYSTEM", color: C.outline },
    { text: "", color: "transparent" },
    { text: "  ◆ SYNAPSE_OS", color: C.primary, bold: true },
    { text: "    Micro-kernel architecture experiment", color: C.onSurfaceVariant },
    { text: "    Tags: RUST · X86_64 · WASM", color: C.outline },
    { text: "", color: "transparent" },
    { text: "  ◆ KV_CORE", color: C.primary, bold: true },
    { text: "    Distributed key-value store with eventual consistency", color: C.onSurfaceVariant },
    { text: "    Tags: GO · GRPC · DOCKER", color: C.outline },
    { text: "", color: "transparent" },
    { text: "  ◆ CRYPTO_VAULT", color: C.primary, bold: true },
    { text: "    E2E encrypted storage with AES-256-GCM", color: C.onSurfaceVariant },
    { text: "    Status: STABLE_PRODUCTION  |  Coverage: 98.4%", color: C.outline },
  ],

  contact: () => [
    { text: "CONTACT CHANNELS", color: C.tertiary, bold: true },
    { text: "", color: "transparent" },
    { text: "  Email:     anshsingh4359@gmail.com", color: C.primary },
    { text: "  Location:  India, Delhi // Remote", color: C.onSurfaceVariant },
    { text: "  GitHub:    github.com/Ansh4359", color: C.onSurfaceVariant },
    { text: "  LinkedIn:  linkedin.com/in/anshsingh4359", color: C.onSurfaceVariant },
    { text: "", color: "transparent" },
    { text: "  Status:    ◉ Available for projects", color: C.tertiary },
  ],

  resume: () => [
    { text: "Initiating resume download...", color: C.tertiary },
    { text: "File: resume.pdf | Size: ~120KB", color: C.outline },
    { text: "Download started in new tab.", color: C.onSurfaceVariant },
  ],

  ls: () => [
    { text: "drwxr-xr-x  /home        (Overview)", color: C.primary },
    { text: "drwxr-xr-x  /projects    (Source)", color: C.primary },
    { text: "drwxr-xr-x  /skills      (Architecture)", color: C.primary },
    { text: "drwxr-xr-x  /contact     (Deployment)", color: C.primary },
    { text: "-rw-r--r--  about.txt", color: C.onSurfaceVariant },
    { text: "-rw-r--r--  resume.pdf", color: C.onSurfaceVariant },
  ],

  "cat about.txt": () => [
    { text: "With over 1.5 years of engineering experience, I view", color: C.onSurfaceVariant },
    { text: "code as a medium for building sustainable digital", color: C.onSurfaceVariant },
    { text: "ecosystems. My approach merges the rigor of systems", color: C.onSurfaceVariant },
    { text: "architecture with the fluid aesthetics of modern", color: C.onSurfaceVariant },
    { text: "user interfaces.", color: C.onSurfaceVariant },
    { text: "", color: "transparent" },
    { text: "I specialize in building scalable distributed systems", color: C.onSurfaceVariant },
    { text: "and high-fidelity frontends that prioritize performance,", color: C.onSurfaceVariant },
    { text: "security, and a relentless commitment to the UX.", color: C.onSurfaceVariant },
  ],

  neofetch: () => [
    { text: "        ████████████████        ansh@singh.dev", color: C.primary },
    { text: "      ██              ██        ───────────────", color: C.primary },
    { text: "    ██  ░░░░░░░░░░░░  ██        OS: PortfolioOS 2.4.0", color: C.primary },
    { text: "    ██  ░░░░░░░░░░░░  ██        Host: Next.js 16", color: C.primary },
    { text: "    ██  ░░░░░░░░░░░░  ██        Kernel: React 19", color: C.primary },
    { text: "    ██  ░░░░░░░░░░░░  ██        Uptime: Since 2026", color: C.primary },
    { text: "      ██              ██        Shell: InteractiveTerminal", color: C.primary },
    { text: "        ████████████████        Resolution: Responsive", color: C.primary },
    { text: "                               Terminal: Interactive", color: C.primary },
    { text: "                               CPU: Full-Stack JS/TS", color: C.tertiary },
    { text: "                               Memory: 1.5+ yrs exp", color: C.tertiary },
  ],

  date: () => [
    { text: new Date().toString(), color: C.onSurfaceVariant },
  ],

  clear: () => "CLEAR",

  history: null, // handled specially

  "sudo hire": () => [
    { text: "[sudo] password for recruiter: ********", color: C.outline },
    { text: "", color: "transparent" },
    { text: "  Permission granted. Welcome aboard.", color: C.tertiary, bold: true },
    { text: "  ████████████████████████████████████████ 100%", color: C.tertiary },
    { text: "  Loading developer assets...", color: C.outline },
    { text: "  Ansh Singh has been added to your team.", color: C.onSurface },
    { text: "", color: "transparent" },
    { text: "  START_DATE: Immediately", color: C.primary },
    { text: "  ROLE: Full Stack Developer", color: C.primary },
    { text: "  STATUS: Ready to ship.", color: C.tertiary },
  ],
};

const ALL_COMMANDS = Object.keys(COMMANDS);

export default function InteractiveTerminal({ open, onClose }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const bootRef = useRef(false);

  // Boot sequence
  if (open && !bootRef.current) {
    bootRef.current = true;
    setBooted(false);
    setLines([]);
    setInput("");
    setHistory([]);
    setHistoryIndex(-1);
  }
  if (!open && bootRef.current) {
    bootRef.current = false;
  }

  useEffect(() => {
    if (!open) return;
    if (booted) return;

    let cancelled = false;
    let i = 0;
    const interval = setInterval(() => {
      if (cancelled) return;
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        i++;
        setLines((prev) => [...prev, line]);
      } else {
        setBooted(true);
        clearInterval(interval);
        inputRef.current?.focus();
      }
    }, 80);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [open, booted]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  if (!open) return null;

  function addOutput(cmd, outputLines) {
    setLines((prev) => [
      ...prev,
      { text: `❯ ${cmd}`, color: C.primary, isPrompt: true },
      ...outputLines,
      { text: "", color: "transparent" },
    ]);
  }

  function processCommand(raw) {
    const cmd = raw.trim().toLowerCase();

    if (!cmd) return;

    // Add to history
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    // Handle clear specially
    if (cmd === "clear") {
      setLines([]);
      return;
    }

    // Handle history
    if (cmd === "history") {
      const output = history.map((h, i) => ({
        text: `  ${String(i + 1).padStart(4)}  ${h}`,
        color: C.onSurfaceVariant,
      }));
      addOutput(raw, output.length > 0 ? output : [{ text: "  (empty)", color: C.outline }]);
      return;
    }

    // Handle resume download
    if (cmd === "resume") {
      window.open("/resume.pdf", "_blank");
    }

    // Find matching command
    const match = ALL_COMMANDS.find((c) => c === cmd || c.startsWith(cmd));
    if (match && COMMANDS[match]) {
      addOutput(raw, COMMANDS[match]());
    } else {
      addOutput(raw, [
        { text: `command not found: ${raw}`, color: C.error },
        { text: 'Type "help" for available commands', color: C.outline },
      ]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (partial) {
        const matches = ALL_COMMANDS.filter((c) => c.startsWith(partial));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          setLines((prev) => [
            ...prev,
            { text: `❯ ${input}`, color: C.primary, isPrompt: true },
            ...matches.map((m) => ({ text: `  ${m}`, color: C.onSurfaceVariant })),
            { text: "", color: "transparent" },
          ]);
        }
      }
    } else if (e.key === "Escape") {
      setInput("");
    }
  }

  return (
    <div
      className="terminal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="terminal-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 720,
          height: "70vh",
          maxHeight: 600,
          background: C.surfaceContainerLowest,
          borderRadius: 12,
          border: `1px solid ${C.outlineVariant}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: C.surfaceContainerHigh,
            borderBottom: `1px solid ${C.outlineVariant}20`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[`${C.error}60`, `${C.secondary}60`, `${C.tertiary}60`].map((color, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            ))}
            <span
              style={{
                marginLeft: 12,
                fontFamily: monoFont,
                fontSize: 9,
                color: C.outline,
                letterSpacing: "0.15em",
              }}
            >
              INTERACTIVE_SHELL.BASH
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: C.outline,
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              display: "flex",
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div
          ref={outputRef}
          onClick={() => inputRef.current?.focus()}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            fontFamily: monoFont,
            fontSize: 13,
            lineHeight: 1.7,
            cursor: "text",
          }}
        >
          {lines.filter(Boolean).map((line, i) => (
            <div
              key={i}
              style={{
                color: line.color,
                fontWeight: line.bold ? 700 : 400,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {line.text}
            </div>
          ))}

          {booted && (
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{ color: C.tertiary, flexShrink: 0 }}>❯ </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontFamily: monoFont,
                  fontSize: 13,
                  color: C.onSurface,
                  padding: 0,
                  boxShadow: "none",
                  caretColor: C.tertiary,
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            borderTop: `1px solid ${C.outlineVariant}15`,
            background: C.surfaceContainer,
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline }}>
            {history.length} commands entered
          </span>
          <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, letterSpacing: "0.05em" }}>
            TAB autocomplete · ↑↓ history · ESC clear
          </span>
        </div>
      </div>
    </div>
  );
}
