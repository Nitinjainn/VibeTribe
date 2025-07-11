import { useState } from 'react';
import Navbar from './Navbar';

const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: "Overview",
      content: [
        {
          title: "What is VibeTribe?",
          description: "VibeTribe is a decentralized travel fund platform built on blockchain technology, enabling community-driven travel experiences through smart contracts and shared economics."
        },
        {
          title: "Why Web3?",
          description: "By leveraging blockchain technology, we ensure complete transparency, reduced costs, and true ownership of your travel investments. Every transaction is verifiable and secure."
        }
      ]
    },
    howItWorks: {
      title: "How It Works",
      content: [
        {
          title: "Smart Contract Integration",
          description: "Our platform uses Ethereum smart contracts to manage travel funds, ensuring automated and trustless execution of contributions and distributions."
        },
        {
          title: "Token Economics",
          description: "VibeTribe tokens (VBT) represent your share in the travel fund pool. Earn rewards through active participation and community engagement."
        },
        {
          title: "Community Governance",
          description: "Token holders can participate in platform decisions, vote on travel fund allocations, and propose new features through our DAO structure."
        }
      ]
    },
    features: {
      title: "Key Features",
      content: [
        {
          title: "Decentralized Travel Fund",
          description: "Pool resources with other travelers in a transparent, blockchain-managed fund that grows through DeFi yield strategies."
        },
        {
          title: "Smart Travel Loans",
          description: "Access travel financing through our collateralized lending protocol, with terms executed automatically via smart contracts."
        },
        {
          title: "Community Rewards",
          description: "Earn VBT tokens for contributing to the ecosystem, sharing travel experiences, and helping other community members."
        }
      ]
    },
    security: {
      title: "Security & Trust",
      content: [
        {
          title: "Smart Contract Audits",
          description: "All our smart contracts are thoroughly audited by leading blockchain security firms to ensure your funds are safe."
        },
        {
          title: "Transparent Operations",
          description: "Every transaction, vote, and fund movement is recorded on the blockchain and publicly verifiable."
        },
        {
          title: "Multi-sig Treasury",
          description: "Platform funds are secured by a multi-signature wallet requiring multiple approvals for any withdrawals."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      <main className="flex-1 relative bg-gradient-to-b from-teal-100 to-white">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              VibeTribe Docs
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your comprehensive guide to decentralized travel funding and community-driven experiences
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(sections).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 
                  ${activeSection === section 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white/90 backdrop-blur-sm'}`}
              >
                {sections[section].title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                {sections[activeSection].title}
              </h2>
              
              <div className="space-y-8">
                {sections[activeSection].content.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-50 hover:border-green-200 transition-all duration-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-12 pt-8 border-t border-green-100">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Links
                </h4>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#" 
                    className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg text-sm text-gray-600 hover:bg-white/70 transition-all duration-200"
                  >
                    📚 Documentation
                  </a>
                  <a 
                    href="#" 
                    className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg text-sm text-gray-600 hover:bg-white/70 transition-all duration-200"
                  >
                    💡 Tutorials
                  </a>
                  <a 
                    href="#" 
                    className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg text-sm text-gray-600 hover:bg-white/70 transition-all duration-200"
                  >
                    🤝 Community
                  </a>
                  <a 
                    href="#" 
                    className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg text-sm text-gray-600 hover:bg-white/70 transition-all duration-200"
                  >
                    🔧 Developer Tools
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
