'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  className?: string
}

export default function QRCodeGenerator({ value, size = 200, className = '' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const generateQR = async () => {
      try {
        setError(false)
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        })
      } catch (err) {
        console.error('QR Code generation error:', err)
        setError(true)
      }
    }

    generateQR()
  }, [value, size])

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center p-4 border-2 border-red-200 rounded-lg bg-red-50">
          <div className="text-red-600 text-sm mb-2">QR Code unavailable</div>
          <div className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
            {value.substring(0, 30)}...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="border-2 border-gray-200 rounded-lg shadow-sm"
        style={{ width: size, height: size }}
      />
    </div>
  )
}