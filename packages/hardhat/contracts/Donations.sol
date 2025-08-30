// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title Donation struct
 */
struct Donation {
    uint256 amount;
    string donorName;
    string message;
    uint256 time;
    address donorAddress;
}

/**
 * @title Project struct
 */
struct Project {
    uint256 id;
    string projectName;
    string ngoName;
    address payable ngoWallet;
    uint256 targetAmount;
    uint256 raisedAmount;
    bool active;
    uint256 createdAt;
}

/**
 * @title NGODonations - Ultra Optimized Version
 * @dev Minimal contract for NGO project donations
 */
contract NGODonations {
    address payable public owner;
    uint256 public nextProjectId = 1;
    
    // Core mappings
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Donation[]) public projectDonations;
    
    // Custom errors (más eficientes que require)
    error InsufficientFunds();
    error InvalidArguments();
    error OnlyOwner();
    error ProjectNotFound();
    error OnlyNGOOrOwner();

    // Events esenciales
    event ProjectCreated(
        uint256 indexed projectId, 
        string projectName, 
        address indexed ngoWallet,
        uint256 targetAmount
    );
    
    event DonationReceived(
        uint256 indexed projectId, 
        address indexed donor, 
        uint256 amount
    );
    
    event FundsWithdrawn(
        uint256 indexed projectId, 
        uint256 amount
    );

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Create project (only owner)
     */
    function createProject(
        string calldata projectName,
        string calldata ngoName,
        address payable ngoWallet,
        uint256 targetAmount
    ) external returns (uint256) {
        if (msg.sender != owner) revert OnlyOwner();
        if (bytes(projectName).length == 0) revert InvalidArguments();
        if (ngoWallet == address(0)) revert InvalidArguments();
        if (targetAmount == 0) revert InvalidArguments();

        uint256 projectId = nextProjectId++;
        
        projects[projectId] = Project({
            id: projectId,
            projectName: projectName,
            ngoName: ngoName,
            ngoWallet: ngoWallet,
            targetAmount: targetAmount,
            raisedAmount: 0,
            active: true,
            createdAt: block.timestamp
        });
        
        emit ProjectCreated(projectId, projectName, ngoWallet, targetAmount);
        return projectId;
    }

    /**
     * @dev Donate to project
     */
    function donateToProject(
        uint256 projectId, 
        string calldata donorName, 
        string calldata message
    ) external payable {
        Project storage project = projects[projectId];
        
        if (project.id == 0) revert ProjectNotFound();
        if (!project.active) revert InvalidArguments();
        if (msg.value == 0) revert InsufficientFunds();

        // Update project
        project.raisedAmount += msg.value;
        
        // Store donation
        projectDonations[projectId].push(Donation({
            amount: msg.value,
            donorName: donorName,
            message: message,
            time: block.timestamp,
            donorAddress: msg.sender
        }));
        
        emit DonationReceived(projectId, msg.sender, msg.value);
    }

    /**
     * @dev Withdraw funds (only NGO or owner)
     */
    function withdrawFunds(uint256 projectId) external {
        Project storage project = projects[projectId];
        
        if (project.id == 0) revert ProjectNotFound();
        if (msg.sender != project.ngoWallet && msg.sender != owner) {
            revert OnlyNGOOrOwner();
        }
        
        uint256 balance = project.raisedAmount;
        if (balance == 0) revert InsufficientFunds();
        
        project.raisedAmount = 0;
        
        (bool sent,) = project.ngoWallet.call{value: balance}("");
        require(sent, "Transfer failed");
        
        emit FundsWithdrawn(projectId, balance);
    }

    /**
     * @dev Get project info
     */
    function getProject(uint256 projectId) external view returns (Project memory) {
        Project memory project = projects[projectId];
        if (project.id == 0) revert ProjectNotFound();
        return project;
    }

    /**
     * @dev Get project donations
     */
    function getProjectDonations(uint256 projectId) external view returns (Donation[] memory) {
        if (projects[projectId].id == 0) revert ProjectNotFound();
        return projectDonations[projectId];
    }

    /**
     * @dev Reject direct ETH
     */
    receive() external payable {
        revert InvalidArguments();
    }
}