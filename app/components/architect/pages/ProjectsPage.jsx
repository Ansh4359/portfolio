import { useState } from "react";
import { FILTER_TABS, PROJECTS } from "../data";
import Icon from "../Icon";
import Footer from "../layout/Footer";
import { C, headFont, monoFont } from "../theme";

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.surfaceBright : C.surfaceContainerLow,
        borderRadius: 12,
        padding: "10px 64px 0",
        transition: "background 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        border: "1px solid rgba(66,71,83,0.1)",
        cursor: "default",
      }}
    >
      {project.status && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="status-dot" style={{ width: 6, height: 6 }} />
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 9,
              color: C.tertiary,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            {project.status}
          </span>
        </div>
      )}

      {project.id === "synapse_os" && (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: C.surfaceContainerHigh,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="grid_view" size={20} style={{ color: C.onSurfaceVariant }} />
        </div>
      )}

      {project.id === "kv_core" && (
        <div style={{ color: C.onSurfaceVariant }}>
          <Icon name="storage" size={28} />
        </div>
      )}

      <div>
        <h3
          style={{
            fontFamily: headFont,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.02em",
            color: C.onSurface,
            marginBottom: 10,
          }}
        >
          {project.name}
        </h3>
        <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.65 }}>{project.desc}</p>
      </div>

      {project.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {project.metrics && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {project.metrics.map(({ key, value, color }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: monoFont, fontSize: 10, color: C.outline, textTransform: "uppercase" }}>
                {key}
              </span>
              <span style={{ fontFamily: monoFont, fontSize: 11, color, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {project.links?.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {project.links.map((link, index) => (
            <button
              key={link}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: index === 0 ? C.onSurface : "transparent",
                color: index === 0 ? C.surface : C.onSurfaceVariant,
                border: index === 0 ? "none" : "1px solid rgba(66,71,83,0.4)",
                fontFamily: monoFont,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              {index === 0 && <Icon name="launch" size={12} />}
              {link}
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
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL_FILES");

  return (
    <div>
      <section style={{ padding: "15px 64px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 10,
              color: C.tertiary,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            DEPLOYMENT ARCHIVE
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <h1
              style={{
                fontFamily: headFont,
                fontSize: "clamp(48px, 7vw, 88px)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: C.onSurface,
              }}
            >
              Featured
              <br />
              <span style={{ color: C.primaryFixedDim }}>Systems.</span>
            </h1>
            {/* <p style={{ maxWidth: 340, fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.7 }}>
              A curated selection of architectural experiments and production-ready applications,
              built with a focus on performance, scalability, and code integrity.
            </p> */}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: "7px 16px",
                borderRadius: 6,
                background: activeFilter === tab ? C.primary : C.surfaceContainerHigh,
                color: activeFilter === tab ? C.onPrimary : C.onSurfaceVariant,
                border: "none",
                fontFamily: monoFont,
                fontSize: 10,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, gridAutoRows: "auto" }}>
          <div style={{ gridColumn: "span 1" }}>
            <ProjectCard project={PROJECTS[0]} />
          </div>

          <div
            style={{
              gridColumn: "span 1",
              borderRadius: 12,
              overflow: "hidden",
              background: C.surfaceContainerLowest,
              border: "1px solid rgba(66,71,83,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 240,
            }}
          >
            <div
              style={{
                width: "85%",
                height: "60%",
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(49,225,146,0.06) 4px, rgba(49,225,146,0.06) 5px)",
                borderRadius: 4,
                position: "relative",
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline
                  points="0,50 30,20 60,70 90,30 120,60 150,10 180,55 210,25 240,65 270,35 300,50"
                  fill="none"
                  stroke="rgba(49,225,146,0.4)"
                  strokeWidth="2"
                />
                <polyline
                  points="0,60 30,40 60,80 90,45 120,70 150,30 180,65 210,40 240,72 270,48 300,60"
                  fill="none"
                  stroke="rgba(173,198,255,0.2)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          <div style={{ gridColumn: "span 1" }}>
            <ProjectCard project={PROJECTS[1]} />
          </div>

          <div style={{ gridColumn: "span 1" }}>
            <ProjectCard project={PROJECTS[2]} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div
              style={{
                background: C.surfaceContainerLow,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(66,71,83,0.1)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 20px",
                  background: C.surfaceContainerHigh,
                  borderBottom: "1px solid rgba(66,71,83,0.15)",
                }}
              >
                {[`${C.error}60`, `${C.secondary}60`, `${C.tertiary}60`].map((color, index) => (
                  <div key={index} style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                ))}
                <span style={{ marginLeft: 12, fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.15em" }}>
                  projects/crypto_vault.v2.sh
                </span>
              </div>
              <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
                <div>
                  <h3
                    style={{
                      fontFamily: headFont,
                      fontWeight: 800,
                      fontSize: 26,
                      letterSpacing: "-0.03em",
                      color: C.onSurface,
                      marginBottom: 14,
                    }}
                  >
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

                <div
                  style={{
                    background: "rgba(49,225,146,0.07)",
                    borderRadius: 12,
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(49,225,146,0.1)",
                  }}
                >
                  <Icon name="security" size={56} style={{ color: "rgba(49,225,146,0.4)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          margin: "0 64px 80px",
          background: C.surfaceContainerLow,
          borderRadius: 16,
          padding: "72px 64px",
          textAlign: "center",
          border: "1px solid rgba(66,71,83,0.1)",
        }}
      >
        <h2
          style={{
            fontFamily: headFont,
            fontWeight: 900,
            fontSize: "clamp(32px, 5vw, 60px)",
            letterSpacing: "-0.03em",
            color: C.onSurface,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          Have a System
          <br />
          <span style={{ color: C.primaryFixedDim }}>In Mind?</span>
        </h2>
        <p style={{ fontSize: 15, color: C.onSurfaceVariant, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          I am currently open to new architectural challenges and full-stack development opportunities.
          Let&apos;s build something robust.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "16px 32px",
              borderRadius: 8,
              background: C.onSurface,
              color: C.surface,
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            INITIATE_CONTACT
          </button>
          <button
            style={{
              padding: "16px 32px",
              borderRadius: 8,
              background: C.surfaceContainerHigh,
              color: C.onSurface,
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              border: "1px solid rgba(66,71,83,0.3)",
              cursor: "pointer",
            }}
          >
            DOWNLOAD_RESUME.pdf
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
