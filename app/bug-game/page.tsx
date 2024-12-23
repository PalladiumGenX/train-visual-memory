import BugGameComponent from "@/components/games/BugGameComponent";

export default function BugGame() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24">
      <h1 className="text-4xl font-bold mb-8">The Bug Game</h1>
      <BugGameComponent />
    </main>
  );
}