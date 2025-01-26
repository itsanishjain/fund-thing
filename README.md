# Crypto On-ramp Integration with Stripe and Alchemy

This project demonstrates how to integrate Stripe's Crypto On-ramp solution with Alchemy's Account Kit for a seamless crypto purchasing experience.

## Prerequisites

- Node.js 20.x or later
- Yarn package manager
- Stripe account with Crypto On-ramp access
- Alchemy account
- (Optional) PostgreSQL database

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Stripe API keys
   - Add your Alchemy API key and Policy ID
   - Set your database URL if using PostgreSQL

3. Initialize the database:
   ```bash
   yarn db:push
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```


