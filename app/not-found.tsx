"use client";

import { useRouter } from "next/navigation";
import { C, headFont, monoFont } from "@/app/components/architect/theme";
import Icon from "@/app/components/architect/Icon";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="code-grid"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="blob-primary"
        style={{ width: 500, height: 500, top: -150, right: -150 }}
      />
      <div
        className="blob-tertiary"
        style={{ width: 400, height: 400, bottom: -100, left: -100 }}
      />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 11,
            color: C.error,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span className="status-dot" style={{ background: C.error }} />
          SYSTEM ERROR
        </div>

        <h1
          style={{
            fontFamily: headFont,
            fontSize: "clamp(80px, 12vw, 160px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: C.onSurface,
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          404
        </h1>

        <p
          style={{
            fontFamily: monoFont,
            fontSize: 14,
            color: C.onSurfaceVariant,
            marginBottom: 8,
          }}
        >
          ROUTE_NOT_FOUND
        </p>

        <p
          style={{
            fontSize: 15,
            color: C.outline,
            maxWidth: 400,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
        >
          The requested endpoint does not exist in the system registry.
          Verify the path and retry.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "14px 28px",
              borderRadius: 8,
              background: C.onSurface,
              color: C.surface,
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <Icon name="home" size={16} />
            NAVIGATE_HOME
          </button>
          <button
            onClick={() => router.back()}
            style={{
              padding: "14px 28px",
              borderRadius: 8,
              background: C.surfaceContainerHigh,
              color: C.onSurface,
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              border: "1px solid rgba(66,71,83,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.surfaceBright;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.surfaceContainerHigh;
            }}
          >
            <Icon name="arrow_back" size={16} />
            GO_BACK
          </button>
        </div>
      </div>
    </div>
  );
}
