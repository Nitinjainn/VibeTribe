// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Investment {
    mapping(address => uint256) public balances;

    event InvestmentReceived(address indexed investor, uint256 amount);

    function invest() external payable {
        require(msg.value > 0, "Must send ETH to invest");
        
        balances[msg.sender] += msg.value;
        emit InvestmentReceived(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
