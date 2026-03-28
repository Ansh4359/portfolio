import { C, bodyFont, monoFont } from "./theme";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: ${C.surface};
        color: ${C.onSurface};
        font-family: ${bodyFont};
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }
      ::selection { background: rgba(173,198,255,0.25); }

      .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        font-size: 20px;
        display: inline-flex;
        align-items: center;
        user-select: none;
      }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${C.surfaceContainerLowest}; }
      ::-webkit-scrollbar-thumb { background: ${C.outlineVariant}; border-radius: 2px; }

      .code-grid {
        background-image: radial-gradient(circle at 2px 2px, ${C.surfaceContainer} 1px, transparent 0);
        background-size: 40px 40px;
      }

      .blob-primary {
        position: absolute;
        border-radius: 50%;
        background: rgba(173,198,255,0.07);
        filter: blur(100px);
        pointer-events: none;
      }

      .blob-tertiary {
        position: absolute;
        border-radius: 50%;
        background: rgba(49,225,146,0.05);
        filter: blur(80px);
        pointer-events: none;
      }

      @keyframes ping {
        75%, 100% { transform: scale(2); opacity: 0; }
      }

      .animate-ping {
        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .fade-up { animation: fadeUp 0.6s ease forwards; }
      .fade-up-d1 { animation: fadeUp 0.6s 0.1s ease both; }
      .fade-up-d2 { animation: fadeUp 0.6s 0.2s ease both; }
      .fade-up-d3 { animation: fadeUp 0.6s 0.3s ease both; }
      .fade-up-d4 { animation: fadeUp 0.6s 0.4s ease both; }
      .fade-up-d5 { animation: fadeUp 0.6s 0.5s ease both; }

      .glass-nav {
        background: rgba(15,20,25,0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }

      input, textarea {
        outline: none;
        font-family: ${bodyFont};
      }

      input:focus, textarea:focus {
        box-shadow: 0 0 0 2px rgba(173,198,255,0.4);
      }

      @keyframes barGrow {
        from { width: 0; }
      }

      .skill-bar { animation: barGrow 1s ease forwards; }

      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      .cursor-blink { animation: blink 1s step-end infinite; }

      .tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 4px;
        font-size: 10px;
        font-family: ${monoFont};
        letter-spacing: 0.05em;
        border: 1px solid rgba(173,198,255,0.15);
        color: ${C.onSurfaceVariant};
        background: rgba(173,198,255,0.06);
      }

      .transition-fast { transition: all 0.15s ease; }
      .transition-med  { transition: all 0.3s ease; }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${C.tertiary};
        position: relative;
      }

      .status-dot::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: ${C.tertiary};
        animation: ping 1s cubic-bezier(0,0,0.2,1) infinite;
      }
    `}</style>
  );
}
