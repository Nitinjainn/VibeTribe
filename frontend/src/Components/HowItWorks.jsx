import { useState } from "react";
import {
  Info,
  Wallet,
  Link2,
  ShieldCheck,
  HelpCircle,
  X,
  Search,
  ChevronRight,
  Globe,
  Clock,
  Star,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import Navbar from "./Navbar";

const docSections = {
  overview: {
    title: "Overview",
    icon: Info,
    category: "Getting Started",
    readTime: "3 min read",
    lastUpdated: "2 days ago",
    subtitle:
      "Your comprehensive guide to decentralized travel funding and community-driven experiences.",
    content: [
      {
        title: "What is VibeTribe?",
        description:
          "VibeTribe is a decentralized travel fund platform built on blockchain technology, enabling community-driven travel experiences through smart contracts and shared economics. Our platform revolutionizes how travelers connect, fund adventures, and share experiences globally.",
        code: null,
        tips: [
          "Connect with like-minded travelers",
          "Fund trips through community pools",
          "Earn rewards for participation",
        ],
      },
      {
        title: "Why Web3?",
        description:
          "By leveraging blockchain technology, we ensure complete transparency, reduced costs, and true ownership of your travel investments. Every transaction is verifiable and secure, eliminating traditional intermediaries.",
        code: null,
        tips: [
          "100% transparent transactions",
          "Lower fees than traditional platforms",
          "True ownership of digital assets",
        ],
      },
      {
        title: "Core Features",
        description:
          "Discover the powerful features that make VibeTribe the premier destination for decentralized travel funding.",
        code: null,
        tips: [
          "Community-driven funding",
          "Smart contract automation",
          "Global network of travelers",
          "Reward system",
        ],
      },
    ],
  },
  addWallet: {
    title: "Add Wallet",
    icon: Wallet,
    category: "Getting Started",
    readTime: "5 min read",
    lastUpdated: "1 week ago",
    subtitle: "Step-by-step instructions to add a crypto wallet to VibeTribe.",
    content: [
      {
        title: "Install MetaMask",
        description:
          "Download and install the MetaMask extension for your browser or the mobile app. MetaMask is the most popular Ethereum wallet and our recommended choice for VibeTribe.",
        code: "https://metamask.io/",
        tips: [
          "Available for Chrome, Firefox, Safari",
          "Mobile apps for iOS and Android",
          "Always download from official sources",
        ],
      },
      {
        title: "Create or Import Wallet",
        description:
          "Follow the MetaMask setup instructions to create a new wallet or import an existing one using your seed phrase. This is your key to accessing the decentralized web.",
        code: null,
        tips: [
          "Keep your seed phrase secure and private",
          "Never share your private keys",
          "Use a hardware wallet for large amounts",
        ],
      },
      {
        title: "Secure Your Wallet",
        description:
          "Enable all security features including password protection, biometric authentication, and consider using a hardware wallet for maximum security.",
        code: null,
        tips: [
          "Enable auto-lock",
          "Use strong passwords",
          "Enable biometric authentication",
        ],
      },
    ],
  },
  connectWallet: {
    title: "Connect Wallet",
    icon: Link2,
    category: "Getting Started",
    readTime: "3 min read",
    lastUpdated: "3 days ago",
    subtitle: "How to connect your wallet and start using VibeTribe features.",
    content: [
      {
        title: "Connect to VibeTribe",
        description:
          'Click the "Connect Wallet" button on the top right of the site. Approve the connection in your MetaMask popup. Make sure you are on the correct network (BSC Testnet or Polygon).',
        code: null,
        tips: [
          "Check the network before connecting",
          "Approve permissions carefully",
          "You can disconnect anytime",
        ],
      },
      {
        title: "Switch Network",
        description:
          "If prompted, allow MetaMask to switch to the required network. VibeTribe supports multiple networks for optimal performance and lower fees.",
        code: null,
        tips: [
          "BSC Testnet for testing",
          "Polygon for lower fees",
          "Ethereum for maximum security",
        ],
      },
      {
        title: "Verify Connection",
        description:
          "Once connected, you should see your wallet address in the top right corner. You can now access all VibeTribe features and start your decentralized travel journey.",
        code: null,
        tips: [
          "Your address will be displayed",
          "All features are now accessible",
          "Transaction history is available",
        ],
      },
    ],
  },
  security: {
    title: "Security & Trust",
    icon: ShieldCheck,
    category: "Security",
    readTime: "7 min read",
    lastUpdated: "1 day ago",
    subtitle:
      "Learn about our security practices and how we keep your funds safe.",
    content: [
      {
        title: "Smart Contract Audits",
        description:
          "All our smart contracts are thoroughly audited by leading blockchain security firms including CertiK and ConsenSys Diligence. We maintain the highest security standards in the industry.",
        code: null,
        tips: [
          "Regular security audits",
          "Bug bounty programs",
          "Open source code",
        ],
      },
      {
        title: "Transparent Operations",
        description:
          "Every transaction, vote, and fund movement is recorded on the blockchain and publicly verifiable. Our commitment to transparency builds trust within the community.",
        code: "https://etherscan.io/address/vibetribe",
        tips: [
          "All transactions are public",
          "Real-time verification",
          "Community oversight",
        ],
      },
      {
        title: "Multi-sig Treasury",
        description:
          "Platform funds are secured by a multi-signature wallet requiring multiple approvals for any withdrawals. This prevents single points of failure and ensures fund security.",
        code: null,
        tips: [
          "Requires multiple signatures",
          "Decentralized control",
          "Enhanced security",
        ],
      },
    ],
  },
  faq: {
    title: "FAQ",
    icon: HelpCircle,
    category: "Support",
    readTime: "10 min read",
    lastUpdated: "5 days ago",
    subtitle: "Frequently asked questions about VibeTribe and its features.",
    content: [
      {
        title: "How can I join a travel community?",
        description:
          'Visit the "Community" section and search for a group that matches your interests. Click "Join" and connect your wallet to participate. Each community has its own rules and requirements.',
        code: null,
        tips: [
          "Browse communities by location",
          "Check requirements before joining",
          "Participate actively in discussions",
        ],
      },
      {
        title: "Can I create my own travel community?",
        description:
          'Yes! Click "Create Community" and fill in the required details. Your community will be visible to others after creation. You can set rules, requirements, and manage members.',
        code: null,
        tips: [
          "Define clear community rules",
          "Set participation requirements",
          "Moderate discussions actively",
        ],
      },
      {
        title: "Are there any fees?",
        description:
          "Joining VibeTribe is completely free. Some communities may have their own event or participation fees, which will be clearly listed. All fees are transparent and paid in cryptocurrency.",
        code: null,
        tips: [
          "No hidden fees",
          "Community fees are optional",
          "All payments in crypto",
        ],
      },
    ],
  },
};

const categories = {
  "Getting Started": ["overview", "addWallet", "connectWallet"],
  Security: ["security"],
  Support: ["faq"],
};

const sidebarOrder = [
  "overview",
  "addWallet",
  "connectWallet",
  "security",
  "faq",
];

const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    "Getting Started": true,
    Security: true,
    Support: true,
  });

  const Icon = docSections[activeSection].icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredSections = sidebarOrder.filter(
    (key) =>
      docSections[key].title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      docSections[key].subtitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-teal-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-80 bg-white/95 backdrop-blur-lg border-r border-green-100 h-[calc(100vh-4rem)] fixed left-0 top-16 z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-6 border-b border-green-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Object.entries(categories).map(([category, sections]) => (
              <div key={category} className="mb-6">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full text-left mb-3 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
                >
                  <span>{category}</span>
                  <ChevronRight
                    className={`w-4 h-4 transform transition-transform ${
                      expandedCategories[category] ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedCategories[category] && (
                  <div className="space-y-1 ml-2">
                    {sections
                      .filter((key) => filteredSections.includes(key))
                      .map((key) => {
                        const IconSidebar = docSections[key].icon;
                        return (
                          <button
                            key={key}
                            onClick={() => setActiveSection(key)}
                            className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group
                              ${
                                activeSection === key
                                  ? "bg-gradient-to-r from-green-50 to-teal-50 text-green-700 border-l-[3px] border-green-500"
                                  : "hover:bg-gradient-to-r hover:from-green-50/30 hover:to-transparent text-gray-600 hover:text-green-700 border-l-[3px] border-transparent"
                              }
                            `}
                          >
                            <IconSidebar
                              className={`w-4 h-4 ${
                                activeSection === key
                                  ? "text-green-600"
                                  : "text-gray-400 group-hover:text-green-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="font-medium">
                                {docSections[key].title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {docSections[key].readTime}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile sidebar */}
        <div className="md:hidden">
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside
            className={`fixed top-16 left-0 z-50 w-80 bg-white/95 backdrop-blur-lg h-[calc(100vh-4rem)] transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6 border-b border-green-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Documentation
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {Object.entries(categories).map(([category, sections]) => (
                <div key={category} className="mb-6">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between w-full text-left mb-3 text-sm font-semibold text-gray-700"
                  >
                    <span>{category}</span>
                    <ChevronRight
                      className={`w-4 h-4 transform transition-transform ${
                        expandedCategories[category] ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {expandedCategories[category] && (
                    <div className="space-y-1 ml-2">
                      {sections
                        .filter((key) => filteredSections.includes(key))
                        .map((key) => {
                          const IconSidebar = docSections[key].icon;
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setActiveSection(key);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                                ${
                                  activeSection === key
                                    ? "bg-gradient-to-r from-green-50 to-teal-50 text-green-700 border-l-[3px] border-green-500"
                                    : "hover:bg-gradient-to-r hover:from-green-50/30 hover:to-transparent text-gray-600 hover:text-green-700 border-l-[3px] border-transparent"
                                }
                              `}
                            >
                              <IconSidebar
                                className={`w-4 h-4 ${
                                  activeSection === key
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {docSections[key].title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {docSections[key].readTime}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-80 min-h-0 flex flex-col pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8 w-full">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-teal-50 rounded-xl">
                  {Icon && <Icon className="w-7 h-7 text-green-600" />}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {docSections[activeSection].title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {docSections[activeSection].subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {docSections[activeSection].readTime}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Last updated {docSections[activeSection].lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {docSections[activeSection].category}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-8">
              {docSections[activeSection].content.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-teal-50 rounded-xl flex items-center justify-center text-lg font-bold text-green-700">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {item.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {item.description}
                        </p>
                        {item.code && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Code/URL:
                              </span>
                              <button
                                onClick={() => copyToClipboard(item.code)}
                                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                              >
                                {copiedCode === item.code ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                            <code className="text-sm text-gray-800 font-mono break-all">
                              {item.code}
                            </code>
                          </div>
                        )}
                        {item.tips && (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-green-700">
                                Pro Tips:
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {item.tips.map((tip, tipIndex) => (
                                <li
                                  key={tipIndex}
                                  className="flex items-start gap-2 text-sm text-green-700"
                                >
                                  <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-12 border-t border-gray-200 mt-12">
              <button
                onClick={() => {
                  const currentIndex = sidebarOrder.indexOf(activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sidebarOrder[currentIndex - 1]);
                  }
                }}
                disabled={sidebarOrder.indexOf(activeSection) === 0}
                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Previous
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Back to Top
              </button>
              <button
                onClick={() => {
                  const currentIndex = sidebarOrder.indexOf(activeSection);
                  if (currentIndex < sidebarOrder.length - 1) {
                    setActiveSection(sidebarOrder[currentIndex + 1]);
                  }
                }}
                disabled={
                  sidebarOrder.indexOf(activeSection) ===
                  sidebarOrder.length - 1
                }
                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HowItWorks;
