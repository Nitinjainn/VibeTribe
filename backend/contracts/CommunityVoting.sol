// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommunityVoting {
    address public daoOwner;
    mapping(address => bool) public isMember;
    uint256 public memberCount;
    
    // Community-specific data
    string public communityId;
    mapping(string => Proposal) public proposals;
    string[] public proposalIds;
    
    struct Proposal {
        string id;
        string description;
        string[] options;
        uint256[] votes;
        uint256 endTime;
        bool executed;
        uint256 winningOption;
        mapping(address => bool) voted;
        bool exists;
    }

    constructor(string memory _communityId, address[] memory members) {
        communityId = _communityId;
        daoOwner = msg.sender;
        
        for (uint i = 0; i < members.length; i++) {
            isMember[members[i]] = true;
            memberCount++;
        }
    }

    modifier onlyMember() {
        require(isMember[msg.sender], "Not a member");
        _;
    }

    function createProposal(string memory proposalId, string memory description, string[] memory options, uint256 durationMinutes) external onlyMember {
        require(options.length >= 2, "At least 2 options");
        require(!proposals[proposalId].exists, "Proposal already exists");
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.description = description;
        newProposal.endTime = block.timestamp + durationMinutes * 1 minutes;
        newProposal.exists = true;
        
        for (uint i = 0; i < options.length; i++) {
            newProposal.options.push(options[i]);
            newProposal.votes.push(0);
        }
        
        proposalIds.push(proposalId);
    }

    function vote(string memory proposalId, uint256 option) external onlyMember {
        Proposal storage p = proposals[proposalId];
        require(p.exists, "Proposal does not exist");
        require(block.timestamp < p.endTime, "Voting ended");
        require(!p.voted[msg.sender], "Already voted");
        require(option < p.options.length, "Invalid option");
        
        p.voted[msg.sender] = true;
        p.votes[option]++;
    }

    function finalize(string memory proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(p.exists, "Proposal does not exist");
        require(block.timestamp >= p.endTime, "Voting still active");
        require(!p.executed, "Already finalized");
        
        p.executed = true;
        uint256 maxVotes = 0;
        uint256 winner = 0;
        
        for (uint i = 0; i < p.votes.length; i++) {
            if (p.votes[i] > maxVotes) {
                maxVotes = p.votes[i];
                winner = i;
            }
        }
        p.winningOption = winner;
    }

    function getProposal(string memory proposalId) public view returns (
        string memory desc,
        string[] memory opts,
        uint256[] memory votes,
        uint256 end,
        bool executed,
        uint256 winningOption,
        bool exists
    ) {
        Proposal storage p = proposals[proposalId];
        return (p.description, p.options, p.votes, p.endTime, p.executed, p.winningOption, p.exists);
    }

    function getProposalCount() public view returns (uint256) {
        return proposalIds.length;
    }

    function getProposalId(uint256 index) public view returns (string memory) {
        require(index < proposalIds.length, "Index out of bounds");
        return proposalIds[index];
    }

    function addMember(address newMember) external {
        require(msg.sender == daoOwner, "Only owner can add");
        require(!isMember[newMember], "Already a member");
        isMember[newMember] = true;
        memberCount++;
    }

    function selfJoin() external {
        // Remove the "Already a member" check to allow re-joining
        // This helps with edge cases where membership status is unclear
        if (!isMember[msg.sender]) {
            isMember[msg.sender] = true;
            memberCount++;
        }
    }
} 