import React, { useState } from 'react';

const MetaMaskGuide = ({ isOpen, onClose, onContinue }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Click 'Connect with MetaMask' to connect your wallet to VibeTribe.",
      image: "🔗"
    },
    {
      title: "Sign the Message",
      description: "MetaMask will ask you to sign a message. This is to verify that you own the wallet address. No transaction will be made and no funds will be transferred.",
      image: "✍️"
    },
    {
      title: "Complete Your Profile",
      description: "Fill in your details to complete your account setup. You can skip some optional fields and complete them later.",
      image: "👤"
    }
  ];

  const handleContinue = () => {
    onContinue();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">MetaMask Signup Guide</h2>
          <p className="text-gray-600">Follow these steps to create your account with MetaMask</p>
        </div>

        <div className="space-y-6 mb-6">
          {steps.map((stepData, index) => (
            <div key={index} className={`flex items-start space-x-4 ${step === index + 1 ? 'bg-blue-50 p-4 rounded-lg' : ''}`}>
              <div className="text-2xl">{stepData.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{stepData.title}</h3>
                <p className="text-sm text-gray-600">{stepData.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• No transaction will be made</li>
            <li>• No funds will be transferred</li>
            <li>• The signature is only used for authentication</li>
            <li>• You can reject and try again if needed</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 p-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it, Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskGuide; 