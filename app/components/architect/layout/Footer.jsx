import { C, monoFont } from "../theme";

export default function Footer() {
  return (
    <footer
      style={{
        background: C.surface,
        borderTop: "1px solid rgba(30,41,59,0.5)",
        padding: "40px 32px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: monoFont,
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#475569",
            textTransform: "uppercase",
          }}
        >
          © 2026 ANSH SINGH. Engineered with intent.
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { label: "GitHub", url: "https://github.com/ansh4359" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/ansh01/" },
            { label: "Twitter", url: "https://x.com/anshsingh4359" },
          ].map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: monoFont,
                fontSize: 10,
                letterSpacing: "0.15em",
                color: "#475569",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.tertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#475569";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
