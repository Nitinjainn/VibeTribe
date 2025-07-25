import React, { useState } from 'react';

const ProposalForm = ({ onSubmit, disabled, noCard }) => {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 options

  const handleOptionChange = (idx, value) => {
    setOptions(options => options.map((opt, i) => i === idx ? value : opt));
  };

  const handleAddOption = () => {
    setOptions(options => [...options, '']);
  };

  const handleRemoveOption = (idx) => {
    if (options.length <= 2) return; // Minimum 2 options
    setOptions(options => options.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !duration) return;
    const filteredOptions = options.map(o => o.trim()).filter(Boolean);
    if (filteredOptions.length < 2) return;
    onSubmit({ description, duration: Number(duration), options: filteredOptions });
    setDescription('');
    setDuration('');
    setOptions(['', '']);
  };

  const formContent = (
    <>
      <h2 className="text-2xl font-bold text-teal-700 mb-2 text-center">Create a New Proposal</h2>
      <input
        type="text"
        className="w-full border border-teal-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400/40 bg-white placeholder-gray-400 transition"
        placeholder="Proposal description (e.g. 'Change trip date to July 20')"
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={disabled}
        maxLength={120}
      />
      <input
        type="number"
        className="w-full border border-teal-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400/40 bg-white placeholder-gray-400 transition"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        min={1}
        disabled={disabled}
      />
      <div className="mb-2">
        <label className="block font-semibold text-teal-700 mb-1">Options</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border border-teal-200 rounded-xl px-3 py-2 text-gray-700 bg-white placeholder-gray-400"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => handleOptionChange(idx, e.target.value)}
              disabled={disabled}
              maxLength={60}
            />
            {options.length > 2 && (
              <button type="button" onClick={() => handleRemoveOption(idx)} className="text-red-500 hover:text-red-700 text-lg font-bold" disabled={disabled}>&times;</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddOption} className="text-teal-600 hover:underline text-sm mt-1" disabled={disabled}>+ Add Option</button>
      </div>
      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 disabled:opacity-50"
        disabled={disabled || !description || !duration || options.filter(o => o.trim()).length < 2}
      >
        {disabled ? "Submitting..." : "Submit Proposal"}
      </button>
    </>
  );

  if (noCard) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full justify-center">
        {formContent}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 border border-teal-100 rounded-2xl shadow-lg p-6 mb-8 flex flex-col gap-4 max-w-2xl mx-auto"
    >
      {formContent}
    </form>
  );
};

export default ProposalForm; 