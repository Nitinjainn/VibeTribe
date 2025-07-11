// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public payee;
    address public admin;
    address public payer; // ✅ Track who paid

    uint public amount;
    bool public isFunded;
    bool public isReleased;

    constructor(address _payee) {
        payee = _payee;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    function deposit() external payable {
        require(!isFunded, "Already funded");
        require(msg.value > 0, "Amount must be greater than 0");
        payer = msg.sender; // ✅ Set payer
        amount = msg.value;
        isFunded = true;
    }

    function releaseFunds() external onlyAdmin {
        require(isFunded, "Not funded");
        require(!isReleased, "Already released");
        isReleased = true;
        payable(payee).transfer(amount);
    }

    function refund() external onlyAdmin {
        require(isFunded, "Not funded");
        require(!isReleased, "Already released");
        isReleased = true;
        payable(payer).transfer(amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
