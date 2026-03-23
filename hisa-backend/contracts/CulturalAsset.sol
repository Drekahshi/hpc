// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CulturalAsset
 * @dev Validates CHAT asset royalties, FPIC consent, and tracks access tags for cultural data.
 */
contract CulturalAssetRegistry {
    address public admin;

    struct Asset {
        string cid;
        address creator;
        uint16 royaltyBps; // Base Points (e.g., 500 = 5%)
        bool validated;
        string fpicHash;   // Hash of Free Prior & Informed Consent document
    }

    mapping(string => Asset) public assets;
    // Maps assetId to a list of access tags (e.g. "#sacred", "#public")
    mapping(string => string[]) public assetTags;

    event AssetCreated(string indexed assetId, address indexed creator, string cid);
    event AssetValidated(string indexed assetId, address[] validators);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Register a new cultural asset on-chain
     */
    function createAsset(
        string memory _assetId,
        string memory _cid,
        address _creator,
        uint16 _royaltyBps,
        string memory _fpicHash,
        string[] memory _accessTags
    ) external onlyAdmin {
        require(bytes(assets[_assetId].cid).length == 0, "Asset already exists");
        require(bytes(_fpicHash).length > 0, "FPIC Consent Hash is mandatory");
        require(_royaltyBps <= 10000, "Royalty cannot exceed 100%");

        assets[_assetId] = Asset({
            cid: _cid,
            creator: _creator,
            royaltyBps: _royaltyBps,
            validated: false,
            fpicHash: _fpicHash
        });

        // Store tags
        for (uint i = 0; i < _accessTags.length; i++) {
            assetTags[_assetId].push(_accessTags[i]);
        }

        emit AssetCreated(_assetId, _creator, _cid);
    }

    /**
     * @dev Mark an asset as validated by the Validator Council
     */
    function approveAsset(string memory _assetId, address[] memory _validators) external onlyAdmin {
        require(bytes(assets[_assetId].cid).length > 0, "Asset does not exist");
        require(!assets[_assetId].validated, "Already validated");
        require(_validators.length >= 2, "Minimum 2 validators required");

        // If the asset is restricted, require 5 validators
        if (isRestricted(_assetId)) {
            require(_validators.length >= 5, "Restricted assets require 5 validators");
        }

        assets[_assetId].validated = true;
        emit AssetValidated(_assetId, _validators);
    }

    /**
     * @dev Check if an asset has restricted tags
     */
    function isRestricted(string memory _assetId) public view returns (bool) {
        string[] storage tags = assetTags[_assetId];
        for (uint i = 0; i < tags.length; i++) {
            if (keccak256(bytes(tags[i])) == keccak256(bytes("#sacred")) ||
                keccak256(bytes(tags[i])) == keccak256(bytes("#restricted"))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Retrieve an asset's core data
     */
    function getAsset(string memory _assetId) external view returns (Asset memory) {
        return assets[_assetId];
    }
}
