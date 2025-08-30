// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ProposalRegistry {
    struct Proposal {
        string title;
        string description;
        address proposer;
    }

    Proposal[] public proposals;

    event ProposalCreated(
        uint indexed id,
        address indexed proposer,
        string title
    );

    function createProposal(
        string calldata title,
        string calldata description
    ) external {
        proposals.push(
            Proposal({
                title: title,
                description: description,
                proposer: msg.sender
            })
        );
        emit ProposalCreated(proposals.length - 1, msg.sender, title);
    }

    function getAllProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }
}