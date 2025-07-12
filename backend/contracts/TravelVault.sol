// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TravelVault {
    // Mapping to store balances of each user
    mapping(address => uint256) public userBalance;
    
    // Mapping to store deposit timestamps for streak tracking
    mapping(address => uint256) public lastDepositTime;
    
    // Mapping to store deposit counts for NFT eligibility
    mapping(address => uint256) public depositCount;

    // Event for deposit
    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    
    // Event for withdrawal
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    
    // Event for streak milestone
    event StreakMilestone(address indexed user, uint256 depositCount);

    // Deposit function - user can deposit ether into their vault
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(msg.value >= 0.001 ether, "Minimum deposit is 0.001 BNB");
        
        userBalance[msg.sender] += msg.value;
        lastDepositTime[msg.sender] = block.timestamp;
        depositCount[msg.sender]++;
        
        emit Deposited(msg.sender, msg.value, block.timestamp);
        
        // Emit streak milestone every 5 deposits
        if (depositCount[msg.sender] % 5 == 0) {
            emit StreakMilestone(msg.sender, depositCount[msg.sender]);
        }
    }

    // Withdraw function - user can withdraw from their vault
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(userBalance[msg.sender] >= _amount, "Insufficient balance");
        
        userBalance[msg.sender] -= _amount;
        
        // Transfer the amount to the user
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, _amount, block.timestamp);
    }

    // Get user's vault balance
    function getBalance(address _user) external view returns (uint256) {
        return userBalance[_user];
    }
    
    // Get user's deposit count
    function getDepositCount(address _user) external view returns (uint256) {
        return depositCount[_user];
    }
    
    // Get user's last deposit time
    function getLastDepositTime(address _user) external view returns (uint256) {
        return lastDepositTime[_user];
    }
    
    // Check if user is eligible for NFT (has made at least 5 deposits)
    function isEligibleForNFT(address _user) external view returns (bool) {
        return depositCount[_user] >= 5;
    }

    // Fallback to prevent accidental ETH transfers
    receive() external payable {
        revert("Please use deposit() function to add funds");
    }
}
