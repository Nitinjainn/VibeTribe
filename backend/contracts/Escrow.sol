// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public payee;
    address public admin;

    mapping(address => uint256) public paidAmount; // Track how much each user paid
    mapping(address => bool) public hasJoined;     // Track if user has joined

    event Joined(address indexed user, uint256 amount);

    constructor(address _payee) {
        payee = _payee;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    function deposit() external payable {
        require(!hasJoined[msg.sender], "Already funded");
        require(msg.value > 0, "Amount must be greater than 0");
        paidAmount[msg.sender] = msg.value;
        hasJoined[msg.sender] = true;
        emit Joined(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
