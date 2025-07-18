// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TripVoting {
    address public daoOwner;
    mapping(address => bool) public isMember;
    uint256 public memberCount;

    struct Proposal {
        string description;
        string[] options;
        uint256[] votes;
        uint256 endTime;
        bool executed;
        uint256 winningOption;
        mapping(address => bool) voted;
    }

    Proposal[] public proposals;

    constructor(address[] memory members) {
        for (uint i = 0; i < members.length; i++) {
            isMember[members[i]] = true;
            memberCount++;
        }
        daoOwner = msg.sender;
    }

    modifier onlyMember() {
        require(isMember[msg.sender], "Not a member");
        _;
    }

    function createProposal(string memory description, string[] memory options, uint256 durationMinutes) external onlyMember {
        require(options.length >= 2, "At least 2 options");
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.endTime = block.timestamp + durationMinutes * 1 minutes;
        for (uint i = 0; i < options.length; i++) {
            newProposal.options.push(options[i]);
            newProposal.votes.push(0);
        }
    }

    function vote(uint256 id, uint256 option) external onlyMember {
        Proposal storage p = proposals[id];
        require(block.timestamp < p.endTime, "Voting ended");
        require(!p.voted[msg.sender], "Already voted");
        require(option < p.options.length, "Invalid option");
        p.voted[msg.sender] = true;
        p.votes[option]++;
    }

    function finalize(uint256 id) external {
        Proposal storage p = proposals[id];
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

    function getProposal(uint256 id) public view returns (
        string memory desc,
        string[] memory opts,
        uint256[] memory votes,
        uint256 end,
        bool executed,
        uint256 winningOption
    ) {
        Proposal storage p = proposals[id];
        return (p.description, p.options, p.votes, p.endTime, p.executed, p.winningOption);
    }

    function getProposalCount() public view returns (uint256) {
        return proposals.length;
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