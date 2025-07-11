import { FaCheckCircle } from "react-icons/fa";

const campaigns = [
  {
    id: 1,
    org: 'VibeTribe DAO',
    name: 'Lively & energetic travel community with blockchain governance',
    imageSrc: 'https://img.freepik.com/premium-photo/happy-tourist-having-fun-enjoying-group-camel-ride-tour-desert_220770-30947.jpg?w=360',
    imageAlt: 'Environmental campaign for sustainability',
    chain: 'Polygon',
    tvl: '2.5K ETH',
    members: '1,247',
    nftRewards: '15',
  },
  {
    id: 2,
    org: 'TravelSafe DAO',
    name: 'AI-powered travel safety with community feedback system',
    imageSrc: 'https://static.wixstatic.com/media/8859a2_38b45e00be994b32afb1fd3001f8604f~mv2.jpeg/v1/fill/w_640,h_856,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/8859a2_38b45e00be994b32afb1fd3001f8604f~mv2.jpeg',
    imageAlt: 'Healthcare support for senior citizens',
    chain: 'Ethereum',
    tvl: '4.2K ETH',
    members: '2,891',
    nftRewards: '28',
  },
  {
    id: 3,
    org: 'AdventureDAO',
    name: 'DeFi payments, NFT experiences, and Web3 connections',
    imageSrc: 'https://img.freepik.com/premium-photo/friends-taking-selfie-winter-time-ai-generated_145713-11960.jpg',
    imageAlt: 'Disaster relief support campaign',
    chain: 'BSC',
    tvl: '1.8K BNB',
    members: '3,156',
    nftRewards: '42',
  },
  // More campaigns...
];

export default function CampaignList() {
  return (
    <div className="bg-white py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 border border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 border border-blue-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-28 h-28 border border-blue-500 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/4 w-24 h-24 border border-blue-500 rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
      </div>

      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Web3 badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-600 text-sm font-medium">Live Campaign DAOs</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          Fuel the Journey!
          <span className="inline-block ml-2 text-blue-500">⚡</span>
        </h2>
        <p className="mt-2 text-lg text-gray-600 text-center">
          Be a part of something extraordinary! <span className="font-semibold">Act NOW</span> to uplift explorers and empower global communities. Together, let&apos;s make every moment count!
        </p>

        {/* Connection lines */}
        <div className="mt-8 mb-4 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-200">
              {/* Animated corner elements */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
              
              {/* Chain badge */}
              <div className="absolute top-4 left-4 px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full backdrop-blur-md z-10">
                {campaign.chain}
              </div>
              
              {/* NFT count badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-gray-900/80 text-white text-xs rounded-full backdrop-blur-md z-10">
                {campaign.nftRewards} NFTs
              </div>
              
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="aspect-w-3 aspect-h-2 relative">
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={campaign.imageSrc}
                    alt={campaign.imageAlt}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <FaCheckCircle className="text-blue-500 text-sm" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-500">{campaign.org}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                
                <h3 className="mt-3 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                  {campaign.name}
                </h3>
                
                {/* Web3 metrics */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-800">{campaign.tvl}</div>
                    <div className="text-xs text-gray-500">TVL</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-800">{campaign.members}</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    Join DAO
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    View
                  </button>
                </div>
                
                {/* Blockchain network indicator */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>On-chain Verified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🏆</span>
                    <span>Yield: 12% APY</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="backdrop-blur-md bg-white/50 rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-blue-500">50+</div>
            <div className="text-sm text-gray-600">Active Campaign DAOs</div>
          </div>
          <div className="backdrop-blur-md bg-white/50 rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-blue-500">$2.5M+</div>
            <div className="text-sm text-gray-600">Total Value Locked</div>
          </div>
          <div className="backdrop-blur-md bg-white/50 rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-blue-500">10K+</div>
            <div className="text-sm text-gray-600">DAO Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}