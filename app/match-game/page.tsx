import MatchesGameComponent from "@/components/games/MatchesGameComponent";

export default function MatchGame() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24">
      <h1 className="text-4xl font-bold mb-8">Memorize the Position of Matches</h1>
      <MatchesGameComponent />
    </main>
  );
};
