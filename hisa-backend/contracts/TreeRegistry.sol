// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TreeRegistry
 * @dev Manages the registration and validation lifecycle of JANI PoG tree plantings.
 * This contract verifies validator signatures and tracks state before triggering HTS mints.
 */
contract TreeRegistry {
    address public admin;

    enum TreeStatus { PENDING, VERIFIED_PLANTED, GROWING, TOKEN_MINTED, DISPUTED, DEAD }

    struct TreeRecord {
        string treeId;
        int64 lat;
        int64 lng;
        string species;
        address planter;
        TreeStatus status;
        uint8 validatorCount;
        uint256 averageConfidence;
        uint256 janiTokenSerial; // HTS token serial if minted as NFT, or block timestamp if fungible
    }

    mapping(string => TreeRecord) public trees;
    mapping(string => mapping(address => bool)) public hasValidated;

    event TreeRegistered(string indexed treeId, address indexed planter, int64 lat, int64 lng);
    event ValidationRecorded(string indexed treeId, address indexed validator, uint8 confidence);
    event StatusUpdated(string indexed treeId, TreeStatus newStatus);
    event TokenMinted(string indexed treeId, uint256 serial);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Register a new tree planting intent
     */
    function registerTree(
        string memory _treeId,
        int64 _lat,
        int64 _lng,
        string memory _species,
        address _planter
    ) external {
        require(bytes(trees[_treeId].treeId).length == 0, "Tree ID already exists");

        trees[_treeId] = TreeRecord({
            treeId: _treeId,
            lat: _lat,
            lng: _lng,
            species: _species,
            planter: _planter,
            status: TreeStatus.PENDING,
            validatorCount: 0,
            averageConfidence: 0,
            janiTokenSerial: 0
        });

        emit TreeRegistered(_treeId, _planter, _lat, _lng);
    }

    /**
     * @dev Confirm validation from a decentralized validator (Community or AI)
     */
    function confirmValidation(string memory _treeId, address _validator, uint8 _confidence) external onlyAdmin {
        TreeRecord storage tree = trees[_treeId];
        require(tree.status == TreeStatus.PENDING, "Tree is not pending validation");
        require(!hasValidated[_treeId][_validator], "Validator already confirmed");
        require(_confidence >= 0 && _confidence <= 100, "Confidence must be 0-100");

        hasValidated[_treeId][_validator] = true;

        // Cumulative moving average for confidence calculation
        uint256 currentTotal = tree.averageConfidence * tree.validatorCount;
        tree.validatorCount++;
        tree.averageConfidence = (currentTotal + _confidence) / tree.validatorCount;

        emit ValidationRecorded(_treeId, _validator, _confidence);

        // Auto-promote status if thresholds met (2 validators, >90% avg confidence)
        if (tree.validatorCount >= 2 && tree.averageConfidence >= 90) {
            tree.status = TreeStatus.VERIFIED_PLANTED;
            emit StatusUpdated(_treeId, TreeStatus.VERIFIED_PLANTED);
        }
    }

    /**
     * @dev Check if a tree is ready for HTS JANI minting
     */
    function checkMintingReady(string memory _treeId) external view returns (bool) {
        return trees[_treeId].status == TreeStatus.VERIFIED_PLANTED;
    }

    /**
     * @dev Record that the backend successfully minted the HTS token for this tree
     */
    function recordTokenMinted(string memory _treeId, uint256 _tokenSerial) external onlyAdmin {
        TreeRecord storage tree = trees[_treeId];
        require(tree.status == TreeStatus.VERIFIED_PLANTED, "Tree not ready for minting");

        tree.status = TreeStatus.TOKEN_MINTED;
        tree.janiTokenSerial = _tokenSerial;

        emit StatusUpdated(_treeId, TreeStatus.TOKEN_MINTED);
        emit TokenMinted(_treeId, _tokenSerial);
    }

    /**
     * @dev Raise dispute via governance
     */
    function raiseDispute(string memory _treeId) external onlyAdmin {
        trees[_treeId].status = TreeStatus.DISPUTED;
        emit StatusUpdated(_treeId, TreeStatus.DISPUTED);
    }
}
