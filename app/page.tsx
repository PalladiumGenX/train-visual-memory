import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container max-w-screen-lg mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Train Your Visual Memory</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Games</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <GameCard 
              title="Bug Game" 
              description="Test your spatial memory by tracking a bug's movement on a grid."
              imageSrc="/bug-wallpaper.png"
              href="/bug-game"
            />
            <GameCard 
              title="Match Game" 
              description="Improve your visual recall by memorizing the position and orientation of matches."
              imageSrc="/matches-thumbnail.jpg"
              href="/match-game"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Train Your Visual Memory?</h2>
          <div className="space-y-4">
            <FAQItem 
              question="What is visual memory?"
              answer="Visual memory is the ability to remember information that you've seen. It's crucial for learning, problem-solving, and everyday tasks."
            />
            <FAQItem 
              question="How can improving visual memory benefit me?"
              answer="Enhanced visual memory can lead to better learning outcomes, improved problem-solving skills, and increased overall cognitive function."
            />
            <FAQItem 
              question="How often should I practice visual memory exercises?"
              answer="For best results, try to practice visual memory exercises for 15-20 minutes daily. Consistency is key to seeing improvements."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function GameCard({ title, description, imageSrc, href }: { title: string, description: string, imageSrc: string, href: string }) {
  return (
    <div className="bg-white flex flex-col w-full md:w-1/2 rounded-lg shadow-md overflow-hidden">
      <Image src={imageSrc} alt={title} width={400} height={400} className="w-full aspect-square object-cover" />
      <div className="p-4">
        <h3 className="text-xl text-gray-600  font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={href} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Play Now
        </Link>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}