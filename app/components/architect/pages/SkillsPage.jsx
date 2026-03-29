import { useEffect, useRef, useState } from "react";
import { SKILL_CATEGORIES, SPECIALIZED, TERMINAL_LINES } from "../data";
import Icon from "../Icon";
import Footer from "../layout/Footer";
import { C, headFont, monoFont } from "../theme";

function SkillBar({ name, pct }) {
  return (
    <div
      style={{
        marginBottom: 12,
        padding: "10px 12px",
        background: "rgba(173,198,255,0.06)",
        border: "1px solid rgba(173,198,255,0.12)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(173,198,255,0.1)";
        e.currentTarget.style.borderColor = "rgba(173,198,255,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(173,198,255,0.06)";
        e.currentTarget.style.borderColor = "rgba(173,198,255,0.12)";
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: C.tertiary,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 13, color: C.onSurface, fontWeight: 500 }}>{name}</span>
    </div>
  );
}

export default function SkillsPage() {
  const terminalRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let i = 0;
          const interval = setInterval(() => {
            i += 1;
            setVisibleLines(i);
            if (i >= TERMINAL_LINES.length) {
              clearInterval(interval);
            }
          }, 300);
        }
      },
      { threshold: 0.3 }
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <section style={{ padding: "20px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 64, alignItems: "start", marginBottom: 96 }}>
          <div>
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 10,
                color: C.secondary,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 20,
              }}
            >
              PERSONAL_STATEMENT
            </span>
            <h1
              style={{
                fontFamily: headFont,
                fontSize: "clamp(40px, 5vw, 68px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: C.onSurface,
                marginBottom: 28,
              }}
            >
              Architecting
              <br />
              <span style={{ color: C.primaryFixedDim }}>Digital Resilience</span>
            </h1>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.8, maxWidth: 560, marginBottom: 20 }}>
              With over 1.5 years of engineering experience, I view code as a medium for building
              sustainable digital ecosystems. My approach merges the rigor of systems architecture with
              the fluid aesthetics of modern user interfaces.
            </p>
            <p style={{ fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.8, maxWidth: 560 }}>
              I specialize in building scalable distributed systems and high-fidelity frontends that
              prioritize performance, security, and a relentless commitment to the user experience.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 10,
                  color: C.outline,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                EXPERTISE_V2
              </span>
              <h2 style={{ fontFamily: headFont, fontSize: 28, fontWeight: 700, color: C.onSurface }}>Core Competencies</h2>
            </div>
            <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, letterSpacing: "0.15em" }}>
              TOTAL RESOURCES: 34 STACKS
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {SKILL_CATEGORIES.map((category) => (
              <div
                key={category.title}
                style={{
                  background: C.surfaceContainerLow,
                  borderRadius: 12,
                  padding: 28,
                  border: "1px solid rgba(66,71,83,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: C.surfaceContainerHigh,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={category.icon} size={18} style={{ color: C.tertiary }} />
                  </div>
                  <h3 style={{ fontFamily: headFont, fontWeight: 700, fontSize: 16, color: C.onSurface }}>{category.title}</h3>
                </div>
                {category.skills.map((skill) => (
                  <SkillBar key={skill.name} {...skill} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 80 }}>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 10,
              color: C.outline,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 8,
            }}
          >
            TOOLBELT_EXTRA
          </span>
          <h2 style={{ fontFamily: headFont, fontSize: 28, fontWeight: 700, color: C.onSurface, marginBottom: 32 }}>
            Specialized Stacks
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {SPECIALIZED.map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  background: C.surfaceContainerLow,
                  borderRadius: 10,
                  padding: "20px 12px",
                  textAlign: "center",
                  border: "1px solid rgba(66,71,83,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.surfaceContainerHigh;
                  e.currentTarget.style.borderColor = "rgba(173,198,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.surfaceContainerLow;
                  e.currentTarget.style.borderColor = "rgba(66,71,83,0.1)";
                }}
              >
                <Icon name={icon} size={24} style={{ color: C.onSurfaceVariant }} />
                <span style={{ fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.05em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={terminalRef}
          style={{
            background: C.surfaceContainerLowest,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(66,71,83,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 20px",
              background: C.surfaceContainerHigh,
              borderBottom: "1px solid rgba(66,71,83,0.2)",
            }}
          >
            {[`${C.error}50`, `${C.secondary}50`, `${C.tertiary}50`].map((color, index) => (
              <div key={index} style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            ))}
            <span style={{ marginLeft: 12, fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.15em" }}>
              CAPABILITIES.SH
            </span>
          </div>
          <div style={{ padding: "28px 32px", fontFamily: monoFont, fontSize: 13, lineHeight: 2, maxHeight: "400px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {TERMINAL_LINES.slice(0, visibleLines).map((line, index) => (
              <div key={index} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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
}
