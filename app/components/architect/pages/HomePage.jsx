import { useEffect, useState } from "react";
import Footer from "../layout/Footer";
import Icon from "../Icon";
import { C, headFont, monoFont } from "../theme";

const DEFAULT_GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "Ansh4359/portfolio";
const DEFAULT_GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "";

function normalizeRepoIdentifier(value) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim().replace(/\.git$/, "");

   const sshMatch = trimmed.match(/^git@github\.com:([^/\s]+)\/([^/\s]+)$/i);
   if (sshMatch) {
    return `${sshMatch[1]}/${sshMatch[2]}`;
   }

  if (trimmed.includes("github.com")) {
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return "";
    } catch {
      return "";
    }
  }

  const normalized = trimmed.replace(/^\//, "").replace(/\/$/, "");
  const repoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
  return repoPattern.test(normalized) ? normalized : "";
}

function formatRelativeTime(dateString) {
  if (!dateString) {
    return "unknown";
  }

  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function firstLine(value) {
  return (value || "").split("\n")[0];
}

function truncate(value, max = 42) {
  if (!value) {
    return "No commit message";
  }

  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}...`;
}

export default function HomePage({ setPage }) {
  const [repoConfig, setRepoConfig] = useState({
    repo: DEFAULT_GITHUB_REPO,
    branch: DEFAULT_GITHUB_BRANCH,
  });

  const [latestCommit, setLatestCommit] = useState({
    message: "Loading latest commit...",
    shortSha: ".......",
    url: `https://github.com/${DEFAULT_GITHUB_REPO}`,
    updatedAt: "syncing",
    repo: DEFAULT_GITHUB_REPO,
    loading: true,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoFromQuery = normalizeRepoIdentifier(params.get("repo") || "");
    const branchFromQuery = (params.get("branch") || "").trim();

    setRepoConfig({
      repo: repoFromQuery || DEFAULT_GITHUB_REPO,
      branch: branchFromQuery || DEFAULT_GITHUB_BRANCH,
    });
  }, []);

  const handleChangeRepo = () => {
    const input = window.prompt(
      "Enter a public GitHub repo (owner/repo or full GitHub URL)",
      repoConfig.repo
    );

    if (input === null) {
      return;
    }

    const normalizedRepo = normalizeRepoIdentifier(input);
    if (!normalizedRepo) {
      setLatestCommit((prev) => ({
        ...prev,
        message: "Invalid repo format",
        shortSha: "owner/repo",
        updatedAt: "try again",
        loading: false,
      }));
      return;
    }

    const branchInput = window.prompt("Optional branch/tag (leave empty for default branch)", repoConfig.branch);
    const normalizedBranch = (branchInput || "").trim();

    const url = new URL(window.location.href);
    url.searchParams.set("repo", normalizedRepo);
    if (normalizedBranch) {
      url.searchParams.set("branch", normalizedBranch);
    } else {
      url.searchParams.delete("branch");
    }
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);

    setRepoConfig({ repo: normalizedRepo, branch: normalizedBranch });
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchLatestCommit() {
      const params = new URLSearchParams({ per_page: "1" });
      if (repoConfig.branch) {
        params.set("sha", repoConfig.branch);
      }

      setLatestCommit((prev) => ({
        ...prev,
        message: "Loading latest commit...",
        shortSha: ".......",
        url: `https://github.com/${repoConfig.repo}`,
        updatedAt: "syncing",
        repo: repoConfig.repo,
        loading: true,
      }));

      try {
        const response = await fetch(`https://api.github.com/repos/${repoConfig.repo}/commits?${params.toString()}`);
        if (!response.ok) {
          let apiMessage = "";
          try {
            const errorBody = await response.json();
            apiMessage = errorBody?.message || "";
          } catch {
            apiMessage = "";
          }

          if (response.status === 404) {
            throw new Error("Repo not found or private");
          }

          if (response.status === 403 && apiMessage.toLowerCase().includes("rate limit")) {
            throw new Error("GitHub rate limit hit");
          }

          throw new Error(apiMessage || `GitHub API returned ${response.status}`);
        }

        const commits = await response.json();
        const commit = commits?.[0];
        if (!commit) {
          throw new Error("No commits returned");
        }

        if (!cancelled) {
          setLatestCommit({
            message: truncate(firstLine(commit.commit?.message)),
            shortSha: (commit.sha || "unknown").slice(0, 7),
            url: commit.html_url || `https://github.com/${repoConfig.repo}/commits`,
            updatedAt: formatRelativeTime(commit.commit?.committer?.date),
            repo: repoConfig.repo,
            loading: false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setLatestCommit({
            message: error instanceof Error ? error.message : "Could not load latest commit",
            shortSha: "offline",
            url: `https://github.com/${repoConfig.repo}/commits`,
            updatedAt: "check GitHub",
            repo: repoConfig.repo,
            loading: false,
          });
        }
      }
    }

    fetchLatestCommit();

    return () => {
      cancelled = true;
    };
  }, [repoConfig.repo, repoConfig.branch]);

  return (
    <div>
      <section
        className="code-grid"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          padding: "5px 64px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="blob-primary" style={{ width: 400, height: 400, top: "20%", right: -80 }} />
        <div className="blob-tertiary" style={{ width: 320, height: 320, bottom: "20%", left: -60 }} />

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "7fr 5fr",
            gap: 64,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div
              className="fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: C.surfaceContainerHigh,
                border: "1px solid rgba(66,71,83,0.2)",
                borderRadius: 999,
                width: "fit-content",
              }}
            >
              <span className="status-dot" />
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: C.tertiary,
                  textTransform: "uppercase",
                }}
              >
                System Status: Operational
              </span>
            </div>

            <h1
              className="fade-up-d1"
              style={{
                fontFamily: headFont,
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: C.onSurface,
              }}
            >
              Building <span style={{ color: C.primaryFixedDim }}>Digital</span> Experiences with{" "}
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>Precision.</em>
            </h1>

            <p className="fade-up-d2" style={{ fontSize: 18, color: C.onSurfaceVariant, maxWidth: 480, lineHeight: 1.7 }}>
              Full-stack developer specializing in architecting scalable applications and crafting
              high-fidelity user interfaces. Turning complex logic into seamless human experiences.
            </p>

            <div className="fade-up-d3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => setPage("Projects")}
                style={{
                  padding: "14px 28px",
                  borderRadius: 8,
                  background: C.primary,
                  color: C.onPrimary,
                  fontFamily: headFont,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 8px 32px rgba(173,198,255,0.2)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(173,198,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(173,198,255,0.2)";
                }}
              >
                View Projects <Icon name="arrow_forward" size={18} />
              </button>
            </div>

            <div className="fade-up-d4" style={{ display: "flex", alignItems: "center", gap: 24, paddingTop: 16 }}>
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#475569",
                  textTransform: "uppercase",
                }}
              >
                Core Stack
              </span>
              <div
                style={{ display: "flex", gap: 16, opacity: 0.5, filter: "grayscale(1)", transition: "all 0.3s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.filter = "none";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.5";
                  e.currentTarget.style.filter = "grayscale(1)";
                }}
              >
                {["data_object", "deployed_code", "javascript", "terminal", "database"].map((icon) => (
                  <Icon key={icon} name={icon} size={28} style={{ color: C.onSurface }} />
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", aspectRatio: "1/1", maxWidth: 420, margin: "0 auto" }}>
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  background: C.surfaceContainerLow,
                  boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src="https://res.cloudinary.com/di2chvoq9/image/upload/v1774358048/IMG_20240921_142339_bqr3uu.jpg"
                  alt="Developer Portrait"
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    mixBlendMode: "luminosity",
                    transition: "mix-blend-mode 0.7s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.mixBlendMode = "normal";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.mixBlendMode = "luminosity";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, ${C.surface} 0%, transparent 60%)`,
                    opacity: 0.6,
                    pointerEvents: "none",
                  }}
                />
              </div>

              <a
                href={"https://github.com/ansh4359"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  bottom: -24,
                  left: -40,
                  background: "rgba(48,53,59,0.65)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(66,71,83,0.2)",
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                  minWidth: 220,
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(49,225,146,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="commit" size={16} style={{ color: C.tertiary }} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: monoFont,
                        fontSize: 9,
                        color: C.outline,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Latest Commit
                    </div>
                    {/* <div
                      style={{
                        fontFamily: monoFont,
                        fontSize: 8,
                        color: C.outline,
                        marginTop: 2,
                        opacity: 0.9,
                      }}
                    >
                      {latestCommit.repo}
                    </div> */}
                    <div style={{ fontFamily: headFont, fontSize: 12, fontWeight: 700, color: C.onSurface, marginTop: 2 }}>
                      {latestCommit.message}
                    </div>
                  </div>
                </div>
                <div style={{ background: C.surfaceContainerHigh, borderRadius: 999, height: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      width: latestCommit.loading ? "35%" : "100%",
                      height: "100%",
                      background: C.tertiary,
                      borderRadius: 999,
                      transition: "width 0.35s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                    fontFamily: monoFont,
                    fontSize: 8,
                    color: C.outline,
                  }}
                >
                  <span>{latestCommit.shortSha}</span>
                  <span>{latestCommit.updatedAt}</span>
                </div>
              </a>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid rgba(173,198,255,0.15)",
                  borderRadius: 16,
                  transform: "translate(16px, 16px)",
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 64px", borderTop: "1px solid rgba(66,71,83,0.1)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
            {[
              {
                num: "01",
                label: "Clean Logic",
                title: "Readable & Maintainable",
                desc: "Prioritizing code quality and architectural integrity above all. Scalability isn't an afterthought; it's the foundation.",
              },
              {
                num: "02",
                label: "Human Design",
                title: "Intuitive Interfaces",
                desc: "Bridging the gap between back-end complexity and front-end simplicity. Design that feels like second nature.",
              },
              {
                num: "03",
                label: "Rapid Delivery",
                title: "Optimized Pipelines",
                desc: "Leveraging modern CI/CD practices to ensure stable, fast, and secure deployments across any environment.",
              },
            ].map(({ num, label, title, desc }) => (
              <div key={num} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span
                  style={{
                    fontFamily: monoFont,
                    fontSize: 10,
                    color: C.primary,
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                  }}
                >
                  {num}. {label}
                </span>
                <h3 style={{ fontFamily: headFont, fontSize: 20, fontWeight: 700, color: C.onSurface }}>{title}</h3>
                <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
