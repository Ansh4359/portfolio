"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlobalStyles from "./architect/GlobalStyles";
import SideNav from "./architect/layout/SideNav";
import TopNav from "./architect/layout/TopNav";
import CommandPalette from "./architect/CommandPalette";

export default function Architect({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <GlobalStyles />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideNav pathname={pathname} router={router} />

        <div style={{ flex: 1, marginLeft: 220 }} ref={mainRef}>
          <TopNav
            pathname={pathname}
            router={router}
            onOpenPalette={() => setPaletteOpen(true)}
          />
          <main style={{ paddingTop: 72 }}>{children}</main>
        </div>
      </div>
    </>
  );
}
