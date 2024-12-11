import type { ReactNode } from "react";

export default function Header(): ReactNode {
  return (
    <header className="bg-blue-700 p-3 rounded-t-lg min-h-max w-full">
      <h1 className="text-white text-2xl font-bold tracking-tight m-0">
        Realtime Chat App
      </h1>
    </header>
  );
}
