import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.3)',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transform: 'rotate(-10deg)',
          }}
        >
          BB
        </div>
      </div>
    ),
    size
  )
} 