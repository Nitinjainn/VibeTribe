const Body = () => {
  return (
    <div className="relative w-full flex justify-center items-center px-0 py-0 overflow-hidden">
      {/* Full-width background image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://miro.medium.com/v2/resize:fit:1200/1*ggfwCv5wd2xih-2MtP9qcw.jpeg')",
        }}
      />

      {/* Animated grid overlay for Web3 feel */}
      <div className="absolute inset-0 z-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(0,0,0,0.22)_25%,rgba(0,0,0,0.22)_26%,transparent_27%,transparent_74%,rgba(0,0,0,0.22)_75%,rgba(0,0,0,0.22)_76%,transparent_77%,transparent)] bg-[length:64px_64px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(0,0,0,0.22)_25%,rgba(0,0,0,0.22)_26%,transparent_27%,transparent_74%,rgba(0,0,0,0.22)_75%,rgba(0,0,0,0.22)_76%,transparent_77%,transparent)] bg-[length:64px_64px]"></div>
        </div>
      </div>
      {/* Centered content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-6 py-12 sm:py-16 md:py-20 gap-2 sm:gap-4 md:gap-6">
        {/* Web3 badge */}
        <div className="mb-6 px-4 py-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-full backdrop-blur-md">
          <span className="text-green-400 text-sm font-medium">
            ⚡ Powered by Web3
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-4 bg-gradient-to-r from-green-400 via-teal-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg font-heading">
          Travel Boldly,{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 text-transparent bg-clip-text">
            Transact Globally
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-medium text-gray-100 leading-relaxed mb-8 max-w-3xl text-center drop-shadow-sm">
          Join the decentralized travel revolution! Connect with fellow
          travelers through blockchain-powered communities.
          <span className="text-green-400">
            {" "}
            Seamless crypto payments
          </span>, <span className="text-cyan-400">NFT experiences</span>, and{" "}
          <span className="text-yellow-300">DAO governance</span> - all in one
          platform.
        </p>

        {/* Web3 features */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400">Multi-chain Support</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span className="text-cyan-400">NFT Rewards</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-400">DAO Governance</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a
            href="/CommunityCards"
            className="group relative rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 text-base sm:text-lg font-semibold text-black shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <span className="relative z-10">🌍 Explore Communities</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </a>
          <a
            href="/CreateCommunity"
            className="group relative rounded-full border border-gray-100 px-8 py-3 text-base sm:text-lg font-semibold text-gray-100 hover:bg-gray-100 hover:text-black transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <span className="relative z-10">🚀 Launch DAO</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </a>
        </div>

        {/* Web3 stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center w-full max-w-2xl mx-auto">
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">2.5K+</div>
            <div className="text-sm text-gray-300">Active DAOs</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-cyan-400">15M+</div>
            <div className="text-sm text-gray-300">Crypto Transactions</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400">500+</div>
            <div className="text-sm text-gray-300">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
