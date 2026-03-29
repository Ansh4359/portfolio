"use client";

import { C, monoFont, headFont } from "./theme";
import Icon from "./Icon";

const SHORTCUT_GROUPS = [
  {
    title: "Navigation",
    items: [
      { keys: ["1"], label: "Go to Home" },
      { keys: ["2"], label: "Go to Projects" },
      { keys: ["3"], label: "Go to Skills" },
      { keys: ["4"], label: "Go to Contact" },
    ],
  },
  {
    title: "Actions",
    items: [
      { keys: ["⌘", "K"], label: "Command Palette" },
      { keys: ["⌘", "\\"], label: "Interactive Terminal" },
      { keys: ["?"], label: "Keyboard Shortcuts" },
    ],
  },
  {
    title: "Terminal",
    items: [
      { keys: ["↑", "↓"], label: "Cycle command history" },
      { keys: ["Tab"], label: "Autocomplete command" },
      { keys: ["Esc"], label: "Clear input / Close" },
      { keys: ["Enter"], label: "Execute command" },
    ],
  },
];

export default function KeyboardShortcuts({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="shortcuts-overlay"
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
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="shortcuts-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
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
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.outlineVariant}15`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="keyboard" size={20} style={{ color: C.primary }} />
            <span
              style={{
                fontFamily: headFont,
                fontSize: 16,
                fontWeight: 700,
                color: C.onSurface,
              }}
            >
              Keyboard Shortcuts
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
              display: "flex",
            }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: C.outline,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {group.title}
              </div>
              {group.items.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.outlineVariant}10`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: monoFont,
                      fontSize: 12,
                      color: C.onSurfaceVariant,
                    }}
                  >
                    {item.label}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {item.keys.map((key) => (
                      <kbd
                        key={key}
                        style={{
                          fontFamily: monoFont,
                          fontSize: 11,
                          color: C.onSurface,
                          background: C.surfaceContainerHigh,
                          padding: "3px 8px",
                          borderRadius: 4,
                          border: `1px solid ${C.outlineVariant}30`,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 20px",
            borderTop: `1px solid ${C.outlineVariant}15`,
            background: C.surfaceContainer,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 10,
              color: C.outline,
              letterSpacing: "0.05em",
            }}
          >
            Press <kbd style={{ background: C.surfaceContainerHigh, padding: "2px 6px", borderRadius: 3, border: `1px solid ${C.outlineVariant}30`, fontSize: 10 }}>?</kbd> to toggle this overlay
          </span>
        </div>
      </div>
    </div>
  );
}
