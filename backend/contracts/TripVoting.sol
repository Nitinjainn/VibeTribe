// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TripVoting {
    address public daoOwner;
    mapping(address => bool) public isMember;
    uint256 public memberCount;

    struct Proposal {
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endTime;
        bool executed;
        bool passed;
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

    function createProposal(string memory description, uint256 durationMinutes) external onlyMember {
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.endTime = block.timestamp + durationMinutes * 1 minutes;
    }

    function vote(uint256 id, bool inFavor) external onlyMember {
        Proposal storage p = proposals[id];
        require(block.timestamp < p.endTime, "Voting ended");
        require(!p.voted[msg.sender], "Already voted");

        p.voted[msg.sender] = true;
        if (inFavor) p.yesVotes++;
        else p.noVotes++;
    }

    function finalize(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp >= p.endTime, "Voting still active");
        require(!p.executed, "Already finalized");

        p.executed = true;
        p.passed = p.yesVotes > p.noVotes;
    }

    function getProposal(uint256 id) public view returns (
        string memory desc,
        uint256 yes,
        uint256 no,
        uint256 end,
        bool passed
    ) {
        Proposal storage p = proposals[id];
        return (p.description, p.yesVotes, p.noVotes, p.endTime, p.passed);
    }

    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }
}
// If any additional code is required for compatibility, it will be added after review. 