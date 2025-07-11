import { useState } from 'react';
import Navbar from './Navbar';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('vision');

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Total Value Locked', value: '$2.5M' },
    { label: 'Community Members', value: '15K+' },
    { label: 'Countries Reached', value: '50+' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 relative bg-gradient-to-b from-teal-100 to-white">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
              Revolutionizing Travel with Web3
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VibeTribe is building the future of decentralized travel experiences, powered by blockchain technology and driven by community.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-100 hover:border-green-200 transition-all duration-200"
              >
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { id: 'vision', label: 'Vision & Mission' },
                { id: 'technology', label: 'Technology' },
                { id: 'community', label: 'Community' },
                { id: 'roadmap', label: 'Roadmap' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 
                    ${activeTab === tab.id 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'vision' && (
                <>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed">
                      To create a decentralized ecosystem where travel experiences are democratized, transparent, and accessible to everyone through the power of blockchain technology.
                    </p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Empowering travelers through decentralized finance, community governance, and shared resources to make travel more affordable and meaningful.
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'technology' && (
                <div className="space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Blockchain Infrastructure</h2>
                    <ul className="space-y-4 text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2">🔗</span>
                        <span>Built on Ethereum for maximum security and interoperability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">📊</span>
                        <span>Smart contracts audited by leading security firms</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">💎</span>
                        <span>Layer 2 integration for reduced gas fees</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">DAO Governance</h2>
                    <p className="text-gray-600 mb-4">
                      VibeTribe is community-owned and operated through our DAO structure, where token holders have direct input in platform decisions.
                    </p>
                    <ul className="space-y-4 text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2">🗳️</span>
                        <span>Proposal and voting system for platform updates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">💫</span>
                        <span>Community rewards for active participation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">🤝</span>
                        <span>Collaborative decision-making on fund allocation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Roadmap</h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-24 font-semibold text-green-600">Q2 2024</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">Platform Launch</h3>
                          <p className="text-gray-600">Initial release of core features and token distribution</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-24 font-semibold text-green-600">Q3 2024</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">DAO Implementation</h3>
                          <p className="text-gray-600">Launch of governance system and community voting</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-24 font-semibold text-green-600">Q4 2024</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">DeFi Integration</h3>
                          <p className="text-gray-600">Advanced yield strategies and lending protocols</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
