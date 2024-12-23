import { LevelSelector } from "@/components/games/CardsGameComponent";

export default function CardsGame() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24">
      <h1 className="text-4xl font-bold mb-8">The Cards Game</h1>
      <LevelSelector />
    </main>
  );
}