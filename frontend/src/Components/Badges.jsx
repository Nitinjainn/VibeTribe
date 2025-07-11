import { FaBolt, FaShareAlt, FaGlobe } from "react-icons/fa";

export default function Example() {
  return (
    <div className="bg-white py-16 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
      </div>

      <div className="mx-auto max-w-6xl px-8 text-center relative z-10">
        {/* Web3 badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 text-sm font-medium">
            Blockchain-Powered Solutions
          </span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800">
          Travel-Fund in a{" "}
          <span className="italic text-green-600 relative">Flash</span>
        </h2>
        <p className="mt-2 text-lg text-gray-600 text-center">
          Raise funds faster than ever!{" "}
          <span className="font-semibold">Support journeys</span> and
          unforgettable experiences with just a click.
        </p>

        {/* Connecting lines animation */}
        <div className="mt-8 mb-4 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-500"></div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="group relative flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-green-200">
            {/* Animated corner elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4">
                <FaBolt className="text-green-500 text-6xl transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                SoloTribe DAO
              </h3>

              {/* Web3 badges */}
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full border border-green-500/20">
                  Smart Contracts
                </span>
                <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full border border-green-500/20">
                  NFT Rewards
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                Decentralized autonomous organization connecting solo travelers
                through blockchain governance. Earn NFT badges for adventures,
                participate in DAO decisions, and access exclusive crypto-funded
                travel experiences with verified community members.
              </p>

              {/* Connection indicator */}
              <div className="mt-4 flex items-center gap-2 text-green-600 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live on Polygon</span>
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-green-200">
            {/* Animated corner elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4">
                <FaShareAlt className="text-green-500 text-6xl transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                CrossChain Pay
              </h3>

              {/* Web3 badges */}
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full border border-green-500/20">
                  Multi-Chain
                </span>
                <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full border border-green-500/20">
                  DeFi
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                Revolutionary cross-chain payment protocol enabling instant
                crypto transactions across 50+ blockchains. Swap tokens, split
                bills, and fund travels with minimal fees using automated market
                makers and liquidity pools.
              </p>

              {/* Connection indicator */}
              <div className="mt-4 flex items-center gap-2 text-green-600 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Multi-Chain Support</span>
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-green-200">
            {/* Animated corner elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4">
                <FaGlobe className="text-green-500 text-6xl transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                GlobePocket DeFi
              </h3>

              {/* Web3 badges */}
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full border border-green-500/20">
                  Yield Farming
                </span>
                <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full border border-green-500/20">
                  Staking
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                Decentralized travel savings protocol with automated yield
                farming. Stake tokens to earn travel rewards, participate in
                liquidity mining, and access exclusive destination NFTs. Your
                funds grow while you plan your next adventure.
              </p>

              {/* Connection indicator */}
              <div className="mt-4 flex items-center gap-2 text-green-600 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Yield Generating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom connection line */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-green-500"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
