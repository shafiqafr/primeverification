'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import jsqr from 'jsqr'

interface QRScannerProps {
  onScan: (data: string) => void
  onError: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      // Always try to use back camera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // ہمیشہ بیک کیمرہ
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        }
      }

      let stream: MediaStream

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (err) {
        console.log('Back camera failed, trying any camera...')
        // Fallback to any camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } }
        })
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        videoRef.current.muted = true
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error('Video play error:', err)
            setError('Could not play video stream')
            onError('Could not play video stream')
          })
        }
      }

      setIsLoading(false)
      setIsScanning(true)
      startScanning()
    } catch (err: any) {
      console.error('Camera error:', err)
      const message = err.message || 'Failed to access camera'
      setError(message)
      onError(message)
      setIsLoading(false)
    }
  }

  const startScanning = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')

      if (!video || !canvas || !ctx || video.readyState !== 4) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      try {
        const code = jsqr(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        })

        if (code) {
          console.log('QR Code detected:', code.data)
          onScan(code.data)
          stopScanning()
        }
      } catch (err) {
        console.error('QR detection error:', err)
      }
    }, 300)
  }

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
  }

  const retryCamera = async () => {
    stopScanning()
    await startCamera()
  }

  useEffect(() => {
    startCamera()

    return () => {
      stopScanning()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="hidden" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-white text-center">
            <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Starting camera...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-white text-center p-4 max-w-sm">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <Alert className="mb-4 border-red-500 bg-red-900/20">
              <AlertDescription className="text-white text-sm">{error}</AlertDescription>
            </Alert>
            <Button onClick={retryCamera} variant="outline" className="text-white border-white hover:bg-white hover:text-black w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Camera
            </Button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-4 border-green-400 border-dashed rounded-lg m-4 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-400 rounded-lg animate-pulse"></div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isScanning ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {isScanning ? 'Scanning...' : 'Ready'}
        </div>
      </div>
    </div>
  )
}
