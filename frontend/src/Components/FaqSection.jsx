import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? 'bg-gray-100 rounded-lg shadow-lg' : ''
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-4 text-left font-medium text-gray-800 hover:bg-gray-50 hover:scale-[1.02] transition-transform duration-200 rounded-md focus:outline-none"
      >
        <span className="text-lg">{question}</span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <FaChevronDown className="text-gray-500" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-screen border-t border-gray-300' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 py-4 px-6">{answer}</p>
      </div>
    </div>
  );
};

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
    <div className="w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <div className="w-full max-w-3xl space-y-2">
        {faqs.map((faq, index) => (
          <FAQ key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
