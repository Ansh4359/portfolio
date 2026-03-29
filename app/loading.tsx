import { C, monoFont } from "@/app/components/architect/theme";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 16,
      }}
    >
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 13,
          color: C.tertiary,
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.tertiary,
            animation: "pulse 1.5s ease infinite",
          }}
        />
        INITIALIZING<span className="cursor-blink">_</span>
      </div>
      <div
        style={{
          width: 200,
          height: 2,
          background: C.surfaceContainerHigh,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "100%",
            background: C.tertiary,
            borderRadius: 1,
            animation: "loadingSlide 1.5s ease infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes loadingSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
