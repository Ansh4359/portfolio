"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import { C, monoFont } from "./theme";

const COMMANDS = [
  { id: "home", label: "Go to Home", icon: "dashboard", category: "Navigation", action: "navigate", target: "/" },
  { id: "projects", label: "View Projects", icon: "source", category: "Navigation", action: "navigate", target: "/projects" },
  { id: "skills", label: "View Skills", icon: "account_tree", category: "Navigation", action: "navigate", target: "/skills" },
  { id: "contact", label: "Contact Me", icon: "rocket_launch", category: "Navigation", action: "navigate", target: "/contact" },
  { id: "copy-email", label: "Copy Email Address", icon: "alternate_email", category: "Actions", action: "copy-email" },
  { id: "resume", label: "Download Resume", icon: "download", category: "Actions", action: "download" },
  { id: "github", label: "Open GitHub", icon: "code", category: "Actions", action: "link", target: "https://github.com/Ansh4359" },
  { id: "linkedin", label: "Open LinkedIn", icon: "person", category: "Actions", action: "link", target: "https://www.linkedin.com/in/ansh01/" },
  { id: "help", label: "Show Available Commands", icon: "help", category: "System", action: "help" },
];

export default function CommandPalette({ open, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const filtered = COMMANDS;

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  function handleSearch(e) {
    const q = e.target.value.toLowerCase();
    const list = document.querySelectorAll(".cmd-item");
    let visibleCount = 0;
    list.forEach((el) => {
      const match = el.dataset.label.includes(q) || el.dataset.category.includes(q);
      el.style.display = match ? "flex" : "none";
      if (match) visibleCount++;
    });
    const noResults = document.getElementById("cmd-no-results");
    if (noResults) noResults.style.display = visibleCount === 0 ? "block" : "none";
    // Reset selection
    list.forEach((el) => el.removeAttribute("data-selected"));
    const firstVisible = document.querySelector('.cmd-item[style*="flex"]');
    if (firstVisible) firstVisible.setAttribute("data-selected", "true");
  }

  function handleKeyDown(e) {
    const items = Array.from(document.querySelectorAll('.cmd-item[style*="flex"], .cmd-item:not([style*="none"])')).filter(
      (el) => el.style.display !== "none"
    );
    const currentIdx = items.findIndex((el) => el.getAttribute("data-selected") === "true");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items.forEach((el) => el.removeAttribute("data-selected"));
        if (currentIdx < items.length - 1) {
          items[currentIdx + 1].setAttribute("data-selected", "true");
          items[currentIdx + 1].scrollIntoView({ block: "nearest" });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        items.forEach((el) => el.removeAttribute("data-selected"));
        if (currentIdx > 0) {
          items[currentIdx - 1].setAttribute("data-selected", "true");
          items[currentIdx - 1].scrollIntoView({ block: "nearest" });
        }
        break;
      case "Enter":
        e.preventDefault();
        if (items[currentIdx]) items[currentIdx].click();
        break;
      case "Escape":
        onClose();
        break;
    }
  }

  function executeCommand(cmd) {
    switch (cmd.action) {
      case "navigate":
        router.push(cmd.target);
        onClose();
        break;
      case "copy-email":
        navigator.clipboard.writeText("anshsingh4359@gmail.com");
        onClose();
        break;
      case "download":
        window.open("/resume.pdf", "_blank");
        onClose();
        break;
      case "link":
        window.open(cmd.target, "_blank");
        onClose();
        break;
      case "help":
        break;
    }
  }

  return (
    <div
      className="cmd-palette-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
      }}
    >
      <div
        className="cmd-palette-backdrop"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="cmd-palette-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          background: C.surfaceContainerLow,
          borderRadius: 12,
          border: `1px solid ${C.outlineVariant}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "12px 16px",
            background: C.surfaceContainerHigh,
            borderBottom: `1px solid ${C.outlineVariant}20`,
          }}
        >
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
            COMMAND_CENTER.SYS
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: `1px solid ${C.outlineVariant}15`,
          }}
        >
          <Icon name="search" size={20} style={{ color: C.outline, flexShrink: 0 }} />
          <input
            ref={inputRef}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: monoFont,
              fontSize: 14,
              color: C.onSurface,
              boxShadow: "none",
            }}
          />
          <kbd
            style={{
              fontFamily: monoFont,
              fontSize: 10,
              color: C.outline,
              background: C.surfaceContainerHigh,
              padding: "3px 8px",
              borderRadius: 4,
              border: `1px solid ${C.outlineVariant}30`,
            }}
          >
            ESC
          </kbd>
        </div>

        <div style={{ maxHeight: 340, overflowY: "auto", padding: "8px 0" }}>
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <div
                style={{
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: C.outline,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "12px 20px 6px",
                }}
              >
                {category}
              </div>
              {cmds.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  className="cmd-item"
                  data-label={cmd.label.toLowerCase()}
                  data-category={cmd.category.toLowerCase()}
                  data-selected={category === Object.keys(grouped)[0] && idx === 0 ? "true" : undefined}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={(e) => {
                    const container = e.currentTarget.parentElement;
                    container.querySelectorAll(".cmd-item").forEach((el) => el.removeAttribute("data-selected"));
                    e.currentTarget.setAttribute("data-selected", "true");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 20px",
                    background: "none",
                    border: "none",
                    borderLeft: "2px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s ease",
                  }}
                >
                  <Icon name={cmd.icon} size={18} style={{ color: C.outline, flexShrink: 0 }} />
                  <span
                    className="cmd-label"
                    style={{
                      flex: 1,
                      fontFamily: monoFont,
                      fontSize: 13,
                      color: C.onSurfaceVariant,
                    }}
                  >
                    {cmd.label}
                  </span>
                </button>
              ))}
            </div>
          ))}
          <div
            id="cmd-no-results"
            style={{
              display: "none",
              padding: "40px 20px",
              textAlign: "center",
              fontFamily: monoFont,
              fontSize: 12,
              color: C.outline,
              letterSpacing: "0.1em",
            }}
          >
            NO_COMMANDS_FOUND
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            padding: "10px 20px",
            borderTop: `1px solid ${C.outlineVariant}15`,
            background: C.surfaceContainer,
          }}
        >
          {[
            { key: "↑↓", label: "navigate" },
            { key: "↵", label: "execute" },
            { key: "esc", label: "close" },
          ].map(({ key, label }) => (
            <span
              key={label}
              style={{
                fontFamily: monoFont,
                fontSize: 10,
                color: C.outline,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <kbd
                style={{
                  background: C.surfaceContainerHigh,
                  padding: "2px 6px",
                  borderRadius: 3,
                  border: `1px solid ${C.outlineVariant}30`,
                  fontSize: 10,
                }}
              >
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .cmd-item[data-selected="true"] {
          background: rgba(173,198,255,0.06) !important;
          border-left-color: ${C.primary} !important;
        }
        .cmd-item[data-selected="true"] .material-symbols-outlined {
          color: ${C.primary} !important;
        }
        .cmd-item[data-selected="true"] .cmd-label {
          color: ${C.onSurface} !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
}
