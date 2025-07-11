

// Grid Pattern Component
const GridPattern = () => (
  <div className="absolute inset-0 opacity-30 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
  </div>
);

// Trusted By Section
const TrustedBySection = () => {
  return (
    <div className="relative bg-white py-20 px-4 overflow-hidden">
      <GridPattern />
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
          <span className="text-green-600 text-sm font-medium">
            BLOCKCHAIN-POWERED
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-gray-800">
          Trusted by the world&apos;s most innovative teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Company logos/cards */}
          <div className="group relative p-6 bg-white rounded-xl border border-green-100 hover:border-green-400/50 transition-all duration-300 hover:scale-105 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-green-200/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative h-16 flex items-center justify-center">
              <div className="w-32 h-8 bg-gradient-to-r from-green-400 to-green-300 rounded opacity-70 flex items-center justify-center">
                <span className="text-green-900 font-semibold text-sm">
                  INNOVATE
                </span>
              </div>
            </div>
          </div>
          <div className="group relative p-6 bg-white rounded-xl border border-green-100 hover:border-green-400/50 transition-all duration-300 hover:scale-105 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-green-200/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative h-16 flex items-center justify-center">
              <div className="w-32 h-8 bg-gradient-to-r from-green-300 to-green-400 rounded opacity-70 flex items-center justify-center">
                <span className="text-green-900 font-semibold text-sm">
                  FUTURE
                </span>
              </div>
            </div>
          </div>
          <div className="group relative p-6 bg-white rounded-xl border border-green-100 hover:border-green-400/50 transition-all duration-300 hover:scale-105 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-green-200/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative h-16 flex items-center justify-center">
              <div className="w-32 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded opacity-70 flex items-center justify-center">
                <span className="text-green-900 font-semibold text-sm">
                  DECENTRALIZE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function Web3Redesign() {
  return (
    <div className=" bg-white">
      <TrustedBySection />
    </div>
  );
}
