import React from 'react';

const getTimeLeft = (endTime) => {
  const now = Date.now(); // Use milliseconds instead of seconds
  const diff = endTime - now;
  if (diff <= 0) return 'Ended';
  const m = Math.floor(diff / (60 * 1000)); // Convert milliseconds to minutes
  const s = Math.floor((diff % (60 * 1000)) / 1000); // Convert remaining milliseconds to seconds
  return `${m}m ${s}s`;
};

const statusBadge = (passed, ended) => {
  if (!ended) return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">Open</span>;
  if (passed === undefined) return <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">Pending</span>;
  if (passed) return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Approved</span>;
  return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Rejected</span>;
};

const ProposalList = ({ proposals, onVote, onFinalize, currentUser, votingStatus }) => {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {proposals.length === 0 && (
        <div className="text-center text-gray-400 italic py-8">No proposals yet. Be the first to create one!</div>
      )}
      {proposals.map((p, idx) => {
        const voted = votingStatus?.[idx]?.voted;
        const passed = p.passed;
        const ended = Date.now() >= p.endTime;
        // Option vote counts: p.optionsVotes is expected to be an array of counts
        return (
          <div key={idx} className="bg-white/90 border border-teal-100 rounded-2xl shadow-lg p-6 flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <h3 className="font-semibold text-teal-700 text-lg">{p.description}</h3>
              <div className="flex items-center gap-2">
                {statusBadge(passed, ended)}
                {voted && <span className="ml-2 text-teal-600 font-semibold text-xs">You voted</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
              <span>Voting ends in: <span className="font-semibold text-teal-700">{getTimeLeft(p.endTime)}</span></span>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {p.options && p.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => onVote(idx, optIdx)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl font-semibold shadow-sm transition disabled:opacity-50"
                  disabled={voted || ended}
                >
                  {opt} {p.optionsVotes && typeof p.optionsVotes[optIdx] === 'number' ? `(${p.optionsVotes[optIdx]})` : ''}
                </button>
              ))}
              {ended && !p.executed && (
                <button
                  onClick={() => onFinalize(idx)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm ml-2"
                >Finalize</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProposalList; 