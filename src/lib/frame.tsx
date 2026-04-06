/** @jsxImportSource frog/jsx */
import { Frog, Button } from 'frog'
import { createPublicClient, http, parseAbi } from 'viem'
import { base } from 'viem/chains'
import { NeynarAPIClient } from '@neynar/nodejs-sdk'

// 1. Configure VIP token (ERC20 standard)
const VIP_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890' // Placeholder Dework VIP Token

// 2. Viem Client Setup (Base network is standard for Farcaster)
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_URL || 'https://mainnet.base.org')
})

const erc20Abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)'
])

// 3. Neynar API (to fetch connected addresses)
const neynarClient = process.env.NEYNAR_API_KEY ? new NeynarAPIClient({ apiKey: process.env.NEYNAR_API_KEY }) : null

// 4. Initialize Frog App
export const app = new Frog({
  basePath: '/api',
  title: 'Triarchy VIP Gate',
})

app.frame('/', (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #1f2937, #111827)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
          color: 'white',
          fontSize: 60,
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ marginBottom: 20 }}>🔥 Dework Token Gate 🔥</div>
        <div style={{ fontSize: 30, color: '#9ca3af' }}>Hold the VIP Token to enter.</div>
      </div>
    ),
    intents: [
      <Button action="/enter">Verify Balance</Button>,
    ],
  })
})

app.frame('/enter', async (c) => {
  const { frameData } = c
  const fid = frameData?.fid
  
  let hasAccess = false
  let verifiedAddresses: string[] = []
  let errorMsg = ''
  
  try {
    if (!fid) {
      throw new Error('Frame validation failed. No FID found.')
    }
    
    // Fetch user Ethereum addresses via Neynar
    if (!neynarClient) {
      // If no Neynar API key, we skip strict validation for local dev
      hasAccess = true 
      errorMsg = 'Dev Mode: No Neynar API Key'
    } else {
        const userData = await neynarClient.fetchBulkUsers({ fids: [fid] })
        const user = userData.users[0]
        if (user) {
          verifiedAddresses = [...(user.verified_addresses?.eth_addresses || []), user.custody_address].filter(Boolean)
        }
        
        // Code-Review-God Optimization: Using Multicall to avoid N+1 RPC queries
        const contracts = verifiedAddresses.map(address => ({
             address: VIP_TOKEN_ADDRESS as `0x${string}`,
             abi: erc20Abi,
             functionName: 'balanceOf',
             args: [address as `0x${string}`]
        }))

        if (contracts.length > 0) {
            const results = await publicClient.multicall({
                contracts,
                allowFailure: true
            })
            
            // Check if any address has a balance > 0
            hasAccess = results.some(res => res.status === 'success' && (res.result as bigint) > BigInt(0))
        }
    }
    
  } catch (err: any) {
    console.error(err)
    errorMsg = err.message
  }

  if (!hasAccess) {
    return c.res({
      image: (
        <div style={{ color: 'white', display: 'flex', flexDirection: 'column', background: '#dc2626', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>Access Denied</div>
          <div style={{ fontSize: 30 }}>You do not hold the required Token.</div>
          {errorMsg && <div style={{ fontSize: 20, marginTop: 20, color: '#fca5a5' }}>{errorMsg}</div>}
        </div>
      ),
      intents: [
        <Button action="/">Go Back</Button>
      ]
    })
  }

  return c.res({
    image: (
      <div style={{ color: '#84cc16', display: 'flex', flexDirection: 'column', background: 'black', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>Access Granted ✅</div>
        <div style={{ fontSize: 30, color: 'white' }}>Welcome to the Sovereign Vaults, FID: {fid}</div>
      </div>
    ),
    intents: [
      <Button.Link href="https://github.com/y4motion">Enter Vault</Button.Link>
    ]
  })
})
