# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Scaffold-Lisk project - a fork of Scaffold-ETH2 built for developing decentralized applications on the Lisk ecosystem and Superchain testnets. The project uses a monorepo structure with two main packages: a Hardhat blockchain development environment and a NextJS frontend application.

## Architecture

- **Monorepo Structure**: Uses Yarn workspaces with two main packages:
  - `packages/hardhat`: Smart contract development, deployment, and testing
  - `packages/nextjs`: React/NextJS frontend application with Web3 integration

- **Key Technologies**:
  - Smart Contracts: Solidity 0.8.17, Hardhat, OpenZeppelin
  - Frontend: NextJS 14, TypeScript, TailwindCSS, DaisyUI
  - Web3 Integration: Wagmi, Viem, RainbowKit, Ethers.js
  - State Management: Zustand
  - Testing: Hardhat (smart contracts), built-in Jest/React Testing Library (frontend)

## Common Development Commands

### Local Development
```bash
# Start local blockchain
yarn chain

# Deploy contracts to local network
yarn deploy

# Start frontend development server
yarn start
```

### Testing and Quality
```bash
# Run smart contract tests
yarn hardhat:test
yarn test  # alias for hardhat:test

# Lint and format
yarn format                    # Format both packages
yarn next:lint                 # Lint NextJS code
yarn hardhat:lint             # Lint Hardhat code
yarn next:check-types          # TypeScript type checking
```

### Production Build
```bash
yarn next:build               # Build NextJS application
```

### Blockchain Operations
```bash
yarn compile                  # Compile smart contracts
yarn generate                 # Generate account
yarn account                  # List accounts
yarn verify                   # Verify contracts on Etherscan
```

### Deployment to Testnets
```bash
yarn deploy --network-options  # Interactive network selection
yarn deploy --network networkName  # Deploy to specific network
```

## Project Configuration

- **Network Configuration**: Defined in `packages/hardhat/hardhat.config.ts` with support for multiple Superchain testnets
- **Frontend Configuration**: `packages/nextjs/scaffold.config.ts` contains DApp settings including:
  - Target networks (defaults to Hardhat local and Lisk Sepolia)
  - Polling intervals
  - Wallet connection settings
- **Chain Definitions**: Custom chain configurations in `packages/nextjs/chains.ts`

## Development Environment Setup

1. Requires Node.js >= v18.17, Yarn, and Git
2. Environment variables are configured via `.env` files in each package directory
3. The project uses Husky for Git hooks and lint-staged for pre-commit checks

## Key Directories

- `packages/hardhat/contracts/`: Smart contract source files
- `packages/hardhat/deploy/`: Deployment scripts
- `packages/hardhat/test/`: Smart contract tests
- `packages/nextjs/app/`: NextJS 14 App Router pages and layouts
- `packages/nextjs/components/`: Reusable React components
- `packages/nextjs/hooks/`: Custom React hooks for Web3 interactions
- `packages/nextjs/services/`: Web3 configuration and services

## Web3 Integration

The frontend uses Wagmi/Viem for Web3 interactions with:
- RainbowKit for wallet connections
- Custom hooks for contract interactions
- Burner wallet support for local development
- Contract hot reload functionality that auto-updates frontend when contracts change

## Smart Contract Development

- Uses Hardhat with TypeScript
- Includes gas reporting and test coverage
- Supports multiple deployment networks via interactive CLI
- Uses OpenZeppelin contracts for standards compliance