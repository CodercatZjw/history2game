import type { ReactNode } from "react";

interface GameSceneProps {
  backgroundImage: string;
  children: ReactNode;
}

export function GameScene({ backgroundImage, children }: GameSceneProps) {
  return (
    <main className="vn-bg relative min-h-screen overflow-x-hidden bg-[#120d0b] text-[#fff7e6]">
      <div
        className="vn-bg absolute inset-0"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      <div className="vn-scrim absolute inset-0" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </main>
  );
}
