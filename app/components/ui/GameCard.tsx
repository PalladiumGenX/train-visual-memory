import Link from "next/link";
import Image from "next/image";
export default function GameCard({ title, description, imageSrc, href }: { title: string, description: string, imageSrc: string, href: string }) {
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