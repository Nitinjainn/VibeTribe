// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrossCommunitySwap {
    enum SwapStatus { Proposed, Accepted, Settled, Cancelled }
    struct Swap {
        address proposerDAO;
        address counterpartyDAO;
        string proposerDetails;
        string counterpartyDetails;
        uint256 proposerAmount;
        uint256 counterpartyAmount;
        SwapStatus status;
        address escrowedBy;
    }
    uint256 public swapCount;
    mapping(uint256 => Swap) public swaps;
    mapping(uint256 => mapping(address => uint256)) public escrowedFunds; // swapId => (DAO => amount)

    event SwapProposed(uint256 indexed swapId, address indexed proposerDAO, address indexed counterpartyDAO);
    event SwapAccepted(uint256 indexed swapId);
    event SwapSettled(uint256 indexed swapId);
    event SwapCancelled(uint256 indexed swapId);
    event EscrowDeposited(uint256 indexed swapId, address indexed dao, uint256 amount);

    function proposeSwap(address counterpartyDAO, string memory proposerDetails, string memory counterpartyDetails, uint256 proposerAmount, uint256 counterpartyAmount) external payable returns (uint256) {
        require(msg.value == proposerAmount, "Escrow must match proposer amount");
        swaps[swapCount] = Swap({
            proposerDAO: msg.sender,
            counterpartyDAO: counterpartyDAO,
            proposerDetails: proposerDetails,
            counterpartyDetails: counterpartyDetails,
            proposerAmount: proposerAmount,
            counterpartyAmount: counterpartyAmount,
            status: SwapStatus.Proposed,
            escrowedBy: msg.sender
        });
        escrowedFunds[swapCount][msg.sender] = msg.value;
        emit SwapProposed(swapCount, msg.sender, counterpartyDAO);
        emit EscrowDeposited(swapCount, msg.sender, msg.value);
        return swapCount++;
    }

    function acceptSwap(uint256 swapId) external payable {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Proposed, "Not open");
        require(msg.sender == s.counterpartyDAO, "Only counterparty can accept");
        require(msg.value == s.counterpartyAmount, "Escrow must match counterparty amount");
        s.status = SwapStatus.Accepted;
        escrowedFunds[swapId][msg.sender] = msg.value;
        emit SwapAccepted(swapId);
        emit EscrowDeposited(swapId, msg.sender, msg.value);
    }

    function settleSwap(uint256 swapId) external {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Accepted, "Not accepted");
        require(msg.sender == s.proposerDAO || msg.sender == s.counterpartyDAO, "Only involved DAOs");
        s.status = SwapStatus.Settled;
        // Settle: send proposerAmount to counterparty, counterpartyAmount to proposer
        payable(s.counterpartyDAO).transfer(s.proposerAmount);
        payable(s.proposerDAO).transfer(s.counterpartyAmount);
        emit SwapSettled(swapId);
    }

    function cancelSwap(uint256 swapId) external {
        Swap storage s = swaps[swapId];
        require(s.status == SwapStatus.Proposed, "Can only cancel open");
        require(msg.sender == s.proposerDAO, "Only proposer can cancel");
        s.status = SwapStatus.Cancelled;
        // Refund proposer
        payable(s.proposerDAO).transfer(s.proposerAmount);
        emit SwapCancelled(swapId);
    }

    function getSwap(uint256 swapId) external view returns (Swap memory) {
        return swaps[swapId];
    }
} 