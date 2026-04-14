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

## ⚙️ Sovereign Node Deployment (Vercel Edge)
This gatekeeper is optimized for blazing-fast Edge Networks to ensure zero latency during the cryptographic handshake.

1. **Deploy to Vercel** — One-click import.
2. **Configure Security Parameters:**
   - `NEYNAR_API_KEY`: Required for Farcaster FID resolution.
   - `RPC_URL`: Base/Mainnet RPC for reading token balances.
   - `NEXT_PUBLIC_SITE_URL`: The host URL of this frame.
   - `NEXT_PUBLIC_MESH_DASHBOARD_URL`: The exact URL of your `x402 Arbitrage Mesh` dashboard. Authorized users are redirected here.

## 🛠️ Architecture Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Core** | Next.js 14 App Router | Edge computing and API routing |
| **Farcaster** | Frog.fm 0.15 + Neynar SDK | Frame rendering and FID validation |
| **On-Chain** | Viem | `multicall` optimized balance reads |

---
*Connected to the primary infrastructure:* [x402-arbitrage-mesh](https://github.com/Stellar-Agent-Labs/x402-arbitrage-mesh)
