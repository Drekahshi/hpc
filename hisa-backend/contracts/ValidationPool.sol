// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ValidationPool
 * @dev Manages the staking, reputation, and slashing of validators within the HISA ecosystem.
 */
contract ValidationPool {
    address public admin;

    uint256 public constant MINIMUM_STAKE = 1000 * 10**8; // Assuming 8 decimal HTS token

    struct ValidatorProfile {
        uint256 stakedAmount;
        uint256 reputationScore; // 0 to 1000, starts at 100
        uint256 totalValidations;
        uint256 successfulValidations;
        bool isActive;
    }

    mapping(address => ValidatorProfile) public validators;

    event ValidatorStaked(address indexed validator, uint256 amount);
    event ValidatorSlashed(address indexed validator, uint256 slashAmount, string reason);
    event ReputationUpdated(address indexed validator, uint256 newScore);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Simulates staking HTS tokens to become a validator
     * Note: In a full Hedera implementation, this would involve holding tokens in a SC or monitoring balances.
     */
    function stake(address _validator, uint256 _amount) external onlyAdmin {
        ValidatorProfile storage profile = validators[_validator];
        
        if (profile.stakedAmount == 0 && profile.reputationScore == 0) {
            // New validator
            profile.reputationScore = 100;
        }

        profile.stakedAmount += _amount;

        if (profile.stakedAmount >= MINIMUM_STAKE) {
            profile.isActive = true;
        }

        emit ValidatorStaked(_validator, _amount);
    }

    /**
     * @dev Slashing mechanism for fraudulent validations (e.g., GPS spoofing detected)
     */
    function slash(address _validator, uint8 _slashPercent, string memory _reason) external onlyAdmin {
        require(_slashPercent <= 100, "Invalid slash percentage");
        ValidatorProfile storage profile = validators[_validator];
        require(profile.stakedAmount > 0, "No stake to slash");

        uint256 slashAmount = (profile.stakedAmount * _slashPercent) / 100;
        profile.stakedAmount -= slashAmount;

        // Heavy reputation penalty
        if (profile.reputationScore >= 50) {
            profile.reputationScore -= 50;
        } else {
            profile.reputationScore = 0;
            profile.isActive = false; // Revoke validator status automatically on zero rep
        }

        if (profile.stakedAmount < MINIMUM_STAKE) {
            profile.isActive = false;
        }

        emit ValidatorSlashed(_validator, slashAmount, _reason);
        emit ReputationUpdated(_validator, profile.reputationScore);
    }

    /**
     * @dev Process successful validations to boost reputation
     */
    function updateReputation(address _validator, int256 _delta) external onlyAdmin {
        ValidatorProfile storage profile = validators[_validator];
        profile.totalValidations++;
        
        if (_delta > 0) {
            profile.successfulValidations++;
            // Max reputation is 1000
            if (profile.reputationScore + uint256(_delta) <= 1000) {
                profile.reputationScore += uint256(_delta);
            } else {
                profile.reputationScore = 1000;
            }
        } else {
            uint256 penalty = uint256(_delta * -1);
            if (profile.reputationScore > penalty) {
                profile.reputationScore -= penalty;
            } else {
                profile.reputationScore = 0;
                profile.isActive = false;
            }
        }

        emit ReputationUpdated(_validator, profile.reputationScore);
    }

    /**
     * @dev Check if address is eligible to be assigned as a validator
     */
    function isEligibleValidator(address _validator) external view returns (bool) {
        ValidatorProfile memory profile = validators[_validator];
        return profile.isActive && profile.stakedAmount >= MINIMUM_STAKE && profile.reputationScore >= 80;
    }
}
