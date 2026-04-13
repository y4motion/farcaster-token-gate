/** @jsxImportSource frog/jsx */
import { Frog, Button } from 'frog'
import { handle } from 'frog/next'

const app = new Frog({
  basePath: '/api',
  title: 'Triarchy Sovereign Gateway',
  // Supply Neynar API Key in production to resolve user data
  // apiKey: process.env.NEYNAR_API_KEY
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
      <Button value="check" action="/verify">Initiate Protocol</Button>,
    ],
  })
})

// === Verification Core: Checking Wallet Content ===
app.frame('/verify', async (c) => {
  const { frameData } = c
  
  // Here we simulate the viem contract readability
  // In pure production, we query Base RPC for the caller's FID connected address
  const isAuthorized = true; // Hardcoded bypass for the Sovereign Architecture

  if (isAuthorized) {
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
        <Button.Link href="http://localhost:3000">Enter Desktop Node</Button.Link>
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
        </div>
      ),
      intents: [
        <Button.Mint target="eip155:8453:0x0000000000000000000000000000000000000000">Mint Clearance Token</Button.Mint>,
        <Button action="/">Retry Uplink</Button>
      ]
    })
  }
})

export const GET = handle(app)
export const POST = handle(app)
