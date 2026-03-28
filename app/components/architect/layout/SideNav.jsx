import Icon from "../Icon";
import { C, monoFont, SIDE_ITEMS } from "../theme";

export default function SideNav({ page, setPage }) {
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 220,
        height: "100vh",
        background: `linear-gradient(to right, ${C.surfaceContainerLow}, ${C.surface})`,
        display: "flex",
        flexDirection: "column",
        paddingTop: 88,
        paddingBottom: 32,
        fontFamily: monoFont,
        fontSize: 13,
        zIndex: 40,
        borderRight: "1px solid rgba(66,71,83,0.15)",
      }}
    >
      <div style={{ padding: "0 28px", marginBottom: 40 }}>
        <div style={{ fontWeight: 700, color: C.tertiary, fontSize: 15 }}>System.root</div>
        <div style={{ color: C.outline, fontSize: 11, marginTop: 4 }}>v2.4.0-stable</div>
      </div>

      <nav style={{ flex: 1 }}>
        {SIDE_ITEMS.map(({ icon, label, page: targetPage }) => {
          const active = page === targetPage;

          return (
            <button
              key={label}
              onClick={() => setPage(targetPage)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "12px 24px",
                background: active ? "rgba(49,225,146,0.08)" : "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
                borderRight: active ? `2px solid ${C.tertiary}` : "2px solid transparent",
                color: active ? C.tertiary : C.outline,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = C.onSurface;
                  e.currentTarget.style.background = `${C.surfaceBright}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = C.outline;
                  e.currentTarget.style.background = "none";
                }
              }}
            >
              <Icon name={icon} size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "0 20px", marginTop: "auto" }}>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          <button
            style={{
              width: "100%",
              padding: "8px 0",
              background: "rgba(49,225,146,0.08)",
              border: "1px solid rgba(49,225,146,0.2)",
              borderRadius: 8,
              color: C.tertiary,
              fontFamily: monoFont,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(49,225,146,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(49,225,146,0.08)";
            }}
          >
            View Resume
          </button>
        </a>
      </div>
    </aside>
  );
}
