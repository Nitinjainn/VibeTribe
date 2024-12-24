import React, { useState } from 'react';
import CreateCommunity from './CreateCommunity';

const ParentComponent = () => {
  const [communities, setCommunities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addCommunity = (newCommunity) => {
    setCommunities((prev) => [...prev, newCommunity]);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="btn">
        Add New Community
      </button>

      {isModalOpen && (
        <CreateCommunity onClose={closeModal} addCommunity={addCommunity} />
      )}

      <div className="community-list">
        <h2 className="text-lg font-bold">Communities</h2>
        {communities.map((community, index) => (
          <div key={index} className="community-card">
            <h3>{community.communityName}</h3>
            <p>{community.description}</p>
            <img src={community.imageSrc} alt={community.communityName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentComponent;
