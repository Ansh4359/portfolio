"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlobalStyles from "./architect/GlobalStyles";
import SideNav from "./architect/layout/SideNav";
import TopNav from "./architect/layout/TopNav";
import CommandPalette from "./architect/CommandPalette";
import InteractiveTerminal from "./architect/InteractiveTerminal";
import KeyboardShortcuts from "./architect/KeyboardShortcuts";
import DoomGame from "./architect/DoomGame";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const ROUTE_MAP = {
  "1": "/",
  "2": "/projects",
  "3": "/skills",
  "4": "/contact",
};

export default function Architect({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [konamiBanner, setKonamiBanner] = useState(false);
  const konamiBufferRef = useRef([]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e) {
      const tag = e.target.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (terminalOpen) { setTerminalOpen(false); return; }
        if (paletteOpen) { setPaletteOpen(false); return; }
        if (shortcutsOpen) { setShortcutsOpen(false); return; }
      }

      if (isInput) return;

      // Konami code
      konamiBufferRef.current.push(e.key);
      if (konamiBufferRef.current.length > KONAMI_CODE.length) {
        konamiBufferRef.current.shift();
      }
      if (
        konamiBufferRef.current.length === KONAMI_CODE.length &&
        konamiBufferRef.current.every((k, i) => k === KONAMI_CODE[i])
      ) {
        konamiBufferRef.current = [];
        setKonamiActive((prev) => {
          const next = !prev;
          if (next) {
            setKonamiBanner(true);
            document.body.classList.add("konami-active");
          } else {
            document.body.classList.remove("konami-active");
          }
          return next;
        });
      }

      if (ROUTE_MAP[e.key]) {
        e.preventDefault();
        router.push(ROUTE_MAP[e.key]);
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, terminalOpen, paletteOpen, shortcutsOpen]);

  useEffect(() => {
    if (!konamiBanner) return;
    const timer = setTimeout(() => setKonamiBanner(false), 3000);
    return () => clearTimeout(timer);
  }, [konamiBanner]);

  return (
    <>
      <GlobalStyles />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <InteractiveTerminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {konamiBanner && (
        <div className="konami-banner">
          <span className="status-dot" style={{ background: "#ffd700", width: 6, height: 6 }} />
          {" "}DEVELOPER MODE ACTIVATED
        </div>
      )}

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideNav pathname={pathname} router={router} />

        <div style={{ flex: 1, marginLeft: 220 }} ref={mainRef}>
          <TopNav
            pathname={pathname}
            router={router}
            onOpenPalette={() => setPaletteOpen(true)}
            onOpenTerminal={() => setTerminalOpen(true)}
          />
          <main style={{ paddingTop: 72 }}>
            {children}
          </main>
        </div>
      </div>

      {konamiActive && (
        <DoomGame
          onClose={() => {
            setKonamiActive(false);
            document.body.classList.remove("konami-active");
          }}
        />
      )}
    </>
  );
}
