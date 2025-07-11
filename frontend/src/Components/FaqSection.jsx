import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

// Grid Pattern Component
const GridPattern = () => (
  <div className="absolute inset-0 opacity-30 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
  </div>
);

// FAQ Component
const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white border border-green-100 rounded-xl overflow-hidden hover:border-green-400/50 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-6 text-left font-medium text-gray-800 hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400/50"
        >
          <span className="text-lg">{question}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-green-500' : 'text-gray-400'}`}
          />
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6 pt-0">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent mb-4"></div>
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

FAQ.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

// FAQ Section
const FAQSection = () => {
  const faqs = [
    {
      question: 'How can I join a travel community?',
      answer: 'You can join a travel community by visiting the "Community" section of our platform and searching for one that matches your travel interests and destinations.',
    },
    {
      question: 'Can I create my own travel community?',
      answer: 'Yes, you can create a new travel community by clicking the "Create Community" button. You can specify the location, travel dates, and the maximum number of members.',
    },
    {
      question: 'What are the benefits of joining a community?',
      answer: 'By joining a community, you can connect with like-minded travelers, share travel tips, plan group trips, and even find travel companions.',
    },
    {
      question: 'Are there any fees to join a community?',
      answer: 'Joining a community is free! However, some communities may organize paid group events or excursions which would have separate charges.',
    },
    {
      question: 'Can I leave a community if my plans change?',
      answer: 'Yes, you can leave a community at any time if your travel plans change or if you find a different community that better suits your needs.',
    },
  ];

  return (
    <div className="relative bg-white py-20 px-4 overflow-hidden">
      <GridPattern />
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <span className="text-green-600 text-sm font-medium">COMMUNITY HUB</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-500 mx-auto rounded-full"></div>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQ key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
