import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BrainBox AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: 'white',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
            marginBottom: '20px',
          }}
        >
          BrainBox AI
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Step-by-Step AI Reasoning
        </div>
      </div>
    ),
    size
  )
} 