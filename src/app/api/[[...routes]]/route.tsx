/** @jsxImportSource frog/jsx */
import { Frog, Button } from 'frog'
import { handle } from 'frog/next'
import { createPublicClient, http, parseAbi } from 'viem'
import { base } from 'viem/chains'
import { NeynarAPIClient } from '@neynar/nodejs-sdk'

const VIP_TOKEN_ADDRESS = '0x10b7fB8CB8095E364E3E56d30C665ddBCEbb7a1F' // Realistic Base Token (e.g., DEGEN or similar Dework Token)

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org')
})

const erc20Abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)'
])

const neynarClient = process.env.NEYNAR_API_KEY ? new NeynarAPIClient({ apiKey: process.env.NEYNAR_API_KEY }) : null

const app = new Frog({
  basePath: '/api',
  title: 'Triarchy Sovereign Gateway',
})

// === Home Frame: The First Point of Contact ===
app.frame('/', (c) => {
  return c.res({
    image: (
      <div style={{
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 50,
        background: '#050505',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace'
      }}>
        <div style={{ color: '#00ff41', marginBottom: 20 }}>D2085: THE TOKEN GATE</div>
        <div style={{ fontSize: 32, opacity: 0.8 }}>Verify your on-chain authorization to proceed.</div>
      </div>
    ),
    intents: [
      <Button key="verify-btn" value="check" action="/verify">Initiate Protocol</Button>,
    ],
  })
})

// === Verification Core: Checking Wallet Content ===
app.frame('/verify', async (c) => {
  const { frameData } = c
  const fid = frameData?.fid
  
  let hasAccess = false
  let verifiedAddresses: string[] = []
  let errorMsg = ''
  
  try {
    if (!fid) {
      throw new Error('Frame validation failed. No FID found.')
    }
    
    if (!neynarClient) {
      hasAccess = true 
      errorMsg = 'Dev Mode: No Neynar API Key'
    } else {
        const userData = await neynarClient.fetchBulkUsers({ fids: [fid] })
        const user = userData.users[0]
        if (user) {
          verifiedAddresses = [...(user.verified_addresses?.eth_addresses || []), user.custody_address].filter(Boolean)
        }
        
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
            
            hasAccess = results.some(res => res.status === 'success' && (res.result as bigint) > BigInt(0))
        }
    }
    
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error)
    errorMsg = error.message
  }

  // Fallback to true if network/RPC fails (Sovereign bypass for hackathon showcase if Dev Mode)
  if (errorMsg.includes('Dev Mode')) {
      hasAccess = true;
  }

  if (hasAccess) {
    return c.res({
      image: (
        <div style={{
          color: '#00ff41',
          display: 'flex',
          flexDirection: 'column',
          fontSize: 60,
          background: '#050505',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'monospace'
        }}>
          <div>✅ ACCESS GRANTED</div>
          <div style={{ fontSize: 30, marginTop: 20, color: '#aaa' }}>x402-Gateway Uplink Established.</div>
        </div>
      ),
      intents: [
        <Button.Link key="link-btn" href="https://x402-arbitrage-mesh.vercel.app">Enter Gateway Target</Button.Link>
      ]
    })
  } else {
    return c.res({
      image: (
        <div style={{
          color: '#ff003c',
          display: 'flex',
          flexDirection: 'column',
          fontSize: 60,
          background: '#050505',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'monospace'
        }}>
          <div>❌ ACCESS DENIED</div>
          <div style={{ fontSize: 30, marginTop: 20, color: '#aaa' }}>Authorization Token Null.</div>
          {errorMsg && <div style={{ fontSize: 20, marginTop: 20, color: '#fca5a5' }}>{errorMsg}</div>}
        </div>
      ),
      intents: [
        <Button.Mint key="mint-btn" target={`eip155:8453:${VIP_TOKEN_ADDRESS}`}>Mint Clearance Token</Button.Mint>,
        <Button key="retry-btn" action="/">Retry Uplink</Button>
      ]
    })
  }
})

export const GET = handle(app)
export const POST = handle(app)
