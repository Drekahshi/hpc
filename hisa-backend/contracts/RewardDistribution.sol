// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RewardDistribution
 * @dev Handles the cross-module token distribution logic for the HISA ecosystem.
 * Automatically splits rewards across JANI, HISA, UMOS, and Community pools
 * based on the SDG impact recorded. Integrates with Hedera Token Service (HTS).
 */
contract RewardDistribution {
    address public admin;

    // Simulated HTS token addresses
    address public janiToken;
    address public hisaToken;
    address public umojaToken;

    event RewardDistributed(address indexed user, string tokenType, uint256 amount, string action);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Configure the external HTS token addresses
     */
    function setTokenAddresses(address _jani, address _hisa, address _umoja) external onlyAdmin {
        janiToken = _jani;
        hisaToken = _hisa;
        umojaToken = _umoja;
    }

    /**
     * @dev Process an SDG action and distribute fractional rewards
     * Example: Jani Tree Plant (70% JANI, 20% HISA, 10% Community)
     */
    function processSDGAction(address _user, string memory _actionType, uint256 _baseRewardAmount) external onlyAdmin {
        require(_baseRewardAmount > 0, "Reward must be greater than 0");

        if (keccak256(bytes(_actionType)) == keccak256(bytes("JANI_TREE_PLANT"))) {
            _distribute(_user, "JANI", (_baseRewardAmount * 70) / 100);
            _distribute(_user, "HISA", (_baseRewardAmount * 20) / 100);
            _distribute(admin, "COMMUNITY", (_baseRewardAmount * 10) / 100);
        } else if (keccak256(bytes(_actionType)) == keccak256(bytes("CHAT_ASSET_UPLOAD"))) {
            _distribute(_user, "CHAT", (_baseRewardAmount * 70) / 100);
            _distribute(_user, "HISA", (_baseRewardAmount * 20) / 100);
            _distribute(admin, "COMMUNITY", (_baseRewardAmount * 10) / 100);
        } else if (keccak256(bytes(_actionType)) == keccak256(bytes("UMOJA_STAKING"))) {
            _distribute(_user, "UMOJA", (_baseRewardAmount * 80) / 100);
            _distribute(_user, "HISA", (_baseRewardAmount * 10) / 100);
            _distribute(admin, "COMMUNITY", (_baseRewardAmount * 10) / 100);
        } else {
            // Default HISA Wellness action
            _distribute(_user, "HISA", (_baseRewardAmount * 90) / 100);
            _distribute(admin, "COMMUNITY", (_baseRewardAmount * 10) / 100);
        }
    }

    /**
     * @dev Internal distribution mock logic
     * In a real Hedera scenario, this would call HTS precompile:
     * IHederaTokenService.transferTokens(...)
     */
    function _distribute(address _to, string memory _tokenType, uint256 _amount) internal {
        if (_amount > 0) {
            emit RewardDistributed(_to, _tokenType, _amount, _tokenType);
        }
    }
}
