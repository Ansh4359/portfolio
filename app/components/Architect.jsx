"use client";

import { useEffect, useRef, useState } from "react";
import GlobalStyles from "./architect/GlobalStyles";
import SideNav from "./architect/layout/SideNav";
import TopNav from "./architect/layout/TopNav";
import ContactPage from "./architect/pages/ContactPage";
import HomePage from "./architect/pages/HomePage";
import ProjectsPage from "./architect/pages/ProjectsPage";
import SkillsPage from "./architect/pages/SkillsPage";

const PAGE_COMPONENTS = {
  Home: HomePage,
  Projects: ProjectsPage,
  Skills: SkillsPage,
  Contact: ContactPage,
};

export default function Architect() {
  const [page, setPage] = useState("Home");
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0 });
  }, [page]);

  const ActivePage = PAGE_COMPONENTS[page] ?? HomePage;

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideNav page={page} setPage={setPage} />

        <div style={{ flex: 1, marginLeft: 220 }} ref={mainRef}>
          <TopNav page={page} setPage={setPage} />
          <main style={{ paddingTop: 72 }}>
            <ActivePage setPage={setPage} />
          </main>
        </div>
      </div>
    </>
  );
}
