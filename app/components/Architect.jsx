"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlobalStyles from "./architect/GlobalStyles";
import SideNav from "./architect/layout/SideNav";
import TopNav from "./architect/layout/TopNav";

export default function Architect({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideNav pathname={pathname} router={router} />

        <div style={{ flex: 1, marginLeft: 220 }} ref={mainRef}>
          <TopNav pathname={pathname} router={router} />
          <main style={{ paddingTop: 72 }}>{children}</main>
        </div>
      </div>
    </>
  );
}
