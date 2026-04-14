<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Stellar_symbol_black.svg/2048px-Stellar_symbol_black.svg.png" width="80" alt="Stellar Logo" />
  <h1>x402 Mesh: Farcaster Sovereign Token Gate</h1>
  <p><strong>The cryptographic bouncer for the AI Agent economy.</strong></p>
  <p><em>Part of the x402 Arbitrage Mesh Submission for DoraHacks 2026</em></p>
</div>

<br/>

## 🛡️ The Alpha Pitch

A Sovereign Mesh needs a sovereign entry point for humans. We built a zero-trust Farcaster Frame that acts as the absolute gatekeeper for the `x402 Arbitrage Mesh` dashboard. 

If you do not hold the required ERC-20 asset on-chain, you cannot see the Mesh. 

## 🚀 Absolute Zero-Trust Features
- **Neynar Bulk User API**: Safely resolves Farcaster FID to connected Ethereum Addresses without trusting client-side injections.
- **Viem Multicall Optimization**: Reads `balanceOf` across multiple connected custody addresses in a *single* `multicall` RPC request, vastly reducing latency and RPC strain.
- **Seamless Mesh Handoff**: Upon cryptographic verification, the user is authorized and redirected straight into the Sovereign WebGL Mesh Dashboard.

## Deployment Instruction (Vercel)
This repository is optimized for Edge Networks. To deploy:
1. Import this repository into Vercel.
2. Set the Environment Variables:
   - `NEYNAR_API_KEY`: Your Neynar API Key.
   - `RPC_URL`: (Optional) Base/Mainnet RPC URL.
   - `NEXT_PUBLIC_SITE_URL`: The production URL (e.g. `https://my-frame.vercel.app`).
3. Deploy!

## Frameworks
- Next.js 14 App Router
- Frog `0.15`
- Viem
- TailwindCSS
