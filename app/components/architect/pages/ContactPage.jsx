import { useState } from "react";
import Icon from "../Icon";
import Footer from "../layout/Footer";
import { C, headFont, monoFont } from "../theme";

const contactItems = [
  { icon: "alternate_email", label: "Direct Channel", value: "hello@digital-architect.dev", color: C.primary },
  { icon: "location_on", label: "Base Operations", value: "Berlin, DE // Remote", color: C.secondary },
];

const socialItems = [
  { icon: "terminal", color: C.tertiary },
  { icon: "share", color: C.primary },
  { icon: "chat_bubble", color: C.secondary },
];

const formFields = [
  { id: "name", label: "Identity.name", placeholder: "John Doe", type: "text" },
  { id: "email", label: "Identity.email", placeholder: "john@protocol.com", type: "email" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

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
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <header>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "rgba(49,225,146,0.1)",
                  marginBottom: 20,
                }}
              >
                <span className="status-dot" />
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 9,
                    color: C.tertiary,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Available for projects
                </span>
              </div>
              <h1
                style={{
                  fontFamily: headFont,
                  fontSize: "clamp(44px, 6vw, 72px)",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: C.onSurface,
                  marginBottom: 20,
                }}
              >
                Let&apos;s build
                <br />
                <span style={{ color: C.primaryFixedDim }}>together.</span>
              </h1>
              <p style={{ fontSize: 15, color: C.onSurfaceVariant, lineHeight: 1.75 }}>
                I specialize in architecting high-performance digital systems. Have a complex technical
                challenge? Let&apos;s discuss the implementation.
              </p>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {contactItems.map(({ icon, label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: C.surfaceContainerHigh,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color,
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={icon} size={20} style={{ color }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: monoFont,
                        fontSize: 9,
                        color: C.outline,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ fontFamily: headFont, fontWeight: 600, fontSize: 15, color: C.onSurface }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p
                style={{
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: C.outline,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 16,
                }}
              >
                Social Protocols
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {socialItems.map(({ icon, color }, index) => (
                  <a
                    key={index}
                    href="#"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: C.surfaceContainerLow,
                      border: "1px solid rgba(66,71,83,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.onSurface,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = color;
                      e.currentTarget.style.background = C.surfaceContainerHigh;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.onSurface;
                      e.currentTarget.style.background = C.surfaceContainerLow;
                    }}
                  >
                    <Icon name={icon} size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -4,
                background:
                  "linear-gradient(135deg, rgba(173,198,255,0.15), rgba(49,225,146,0.08), rgba(162,231,255,0.12))",
                borderRadius: 16,
                filter: "blur(20px)",
                opacity: 0.6,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                background: C.surfaceContainerLow,
                borderRadius: 12,
                padding: 40,
                border: "1px solid rgba(66,71,83,0.1)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 36,
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(66,71,83,0.1)",
                }}
              >
                {[`${C.error}50`, `${C.secondary}50`, `${C.tertiary}50`].map((color, index) => (
                  <div key={index} style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                ))}
                <span style={{ marginLeft: 12, fontFamily: monoFont, fontSize: 9, color: C.outline, letterSpacing: "0.2em" }}>
                  Transmission_Interface.sys
                </span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {formFields.map(({ id, label, placeholder, type }) => (
                    <div key={id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label
                        style={{
                          fontFamily: monoFont,
                          fontSize: 9,
                          color: C.primary,
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[id]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [id]: e.target.value }))}
                        required
                        style={{
                          background: C.surfaceContainerLowest,
                          border: "none",
                          borderRadius: 10,
                          padding: "14px 20px",
                          color: C.onSurface,
                          fontSize: 14,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      fontFamily: monoFont,
                      fontSize: 9,
                      color: C.primary,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                    }}
                  >
                    Payload.message
                  </label>
                  <textarea
                    placeholder="Initialize transmission details..."
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    required
                    style={{
                      background: C.surfaceContainerLowest,
                      border: "none",
                      borderRadius: 10,
                      padding: "14px 20px",
                      color: C.onSurface,
                      fontSize: 14,
                      resize: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "18px 0",
                    borderRadius: 10,
                    background: sent ? C.tertiary : C.primary,
                    color: sent ? "#002e69" : C.onPrimary,
                    fontFamily: headFont,
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: "0 8px 24px rgba(173,198,255,0.15)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {sent ? (
                    <>
                      <Icon name="check_circle" size={20} /> Transmission Sent!
                    </>
                  ) : (
                    <>
                      <span>Execute Send Message</span>
                      <Icon name="send" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(48,53,59,0.3)",
                  backdropFilter: "blur(8px)",
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(66,71,83,0.1)",
                }}
              >
                <Icon name="encrypted" size={14} style={{ color: C.tertiary }} />
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 9,
                    color: C.onSurfaceVariant,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
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
}
