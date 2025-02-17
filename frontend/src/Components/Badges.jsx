import { FaBolt, FaShareAlt, FaGlobe } from "react-icons/fa";

export default function Example() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
        Travel-Fund in a <span className="italic text-green-600"> Flash</span>
        </h2>
        <p className="mt-2 text-lg text-gray-600 text-center">
   Raise funds faster than ever! <span className="font-semibold">Support journeys</span> and unforgettable experiences with just a click.
</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <FaBolt className="text-green-500 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">SoloTribe</h3>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            Connects solo travelers with like-minded adventurers, offering effortless payments, unique experiences, and instant connections. Explore new places, join unknown groups, and make lasting friendships—all while traveling independently.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <FaShareAlt className="text-green-500 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Transact Globally</h3>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            Simplifies international payments, allowing users to send and receive money across borders effortlessly. With secure, fast transactions, it ensures seamless financial exchanges, making global commerce and travel more accessible.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <FaGlobe className="text-green-500 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">GlobePocket</h3>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            It is a platform designed to help travelers easily collect funds for their journeys. It enables users to save, track, and manage travel expenses, making global adventures affordable and accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
