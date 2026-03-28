import { useEffect, useState } from "react";
import Icon from "../Icon";
import { C, headFont, NAV_LINKS } from "../theme";

export default function TopNav({ pathname, router }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="glass-nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: scrolled ? "1px solid rgba(66,71,83,0.3)" : "1px solid transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px 0",
          height: 72,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            fontFamily: headFont,
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: "-0.04em",
            color: "#f1f5f9",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Ansh Singh K.
        </button>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              style={{
                fontFamily: headFont,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "-0.01em",
                color: pathname === path ? C.primary : C.outline,
                background: "none",
                border: "none",
                cursor: "pointer",
                borderBottom: pathname === path ? `2px solid ${C.primary}` : "2px solid transparent",
                paddingBottom: 4,
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["terminal", "code"].map((ic) => (
            <button
              key={ic}
              style={{
                padding: 8,
                borderRadius: 8,
                background: "none",
                border: "none",
                color: C.primary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(173,198,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <Icon name={ic} size={20} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
