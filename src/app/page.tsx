import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Triarchy Token Gate',
  description: 'A sovereign Farcaster Frame.',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.png`,
    'fc:frame:button:1': 'Enter Gate',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api`,
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Triarchy Token Gate Frame</h1>
      <p className="text-gray-400">Этот URL предназначен для парсинга ботами Farcaster/Warpcast.</p>
    </main>
  )
}
