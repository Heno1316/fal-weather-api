## Prerequisites

- Node 16.15 LTS
- Yarn 1.22.19
- MongoDB
- PM2

## Setup

	# Copy environment
    cp .env.example .env

	# Install dependencies
    yarn or yarn install

## Running Development

    yarn start:dev

## Running Production

	# Pull latest changes
    git pull origin main

	# Install dependencies
    yarn

	# Take a build of latest changes
    yarn build

	# Start pm2 instance Note: only the first time you create PM2 instance
    yarn pm2:start

	# Restart pm2 instnace
    yarn pm2:restart

## Directory Structure

    ├── dist                        # Compiled build files
    ├── docs                        # Documentation
    ├── node_modules                # Dependency packages
    ├── src                         # Source code
        ├── configs                 # Configuration objects
        ├── environments            # Environment variables
        ├── modules                 # Core logic represent as each modules
        ├── shared                  # Common service available gloablly
        ├── utils                   # Utility or helper class
    ├── test                        # End-To-End testing configuration
