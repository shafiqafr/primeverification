'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, QrCode, AlertTriangle, ChevronDown } from 'lucide-react'
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
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown')
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check camera permissions and get available devices
  const checkCameraPermissions = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser')
      }

      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setPermissionStatus(permission.state)

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setCameraDevices(videoDevices)
     
      if (videoDevices.length > 0) {
        // پشت والا کیمرہ تلاش کریں (rear/back camera)
        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'))
        if (backCamera) {
          setSelectedCamera(backCamera.deviceId)
        } else {
          setSelectedCamera(videoDevices[0].deviceId) // پہلا کیمرہ استعمال کریں
        }
      }

      permission.addEventListener('change', () => {
        setPermissionStatus(permission.state)
      })

      return true
    } catch (err) {
      console.error('Permission check error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to check camera permissions'
      setError(errorMessage)
      onError(errorMessage)
      return false
    }
  }

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const hasPermission = await checkCameraPermissions()
      if (!hasPermission || !selectedCamera) {
        setIsLoading(false)
        return
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      // کیمرہ کی ترجیح: پہلے پیچھے والا کیمرہ استعمال کریں
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: selectedCamera },
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        }
      }

      console.log('Requesting camera with constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        videoRef.current.setAttribute('muted', 'true')
       
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play()
                .then(resolve)
                .catch(reject)
            }
            videoRef.current.onerror = reject
          } else {
            reject(new Error('Video element not available'))
          }
        })

        console.log('Camera started successfully')
        setIsLoading(false)
        setIsScanning(true)
        startScanning()
      }
    } catch (err) {
      console.error('Camera error:', err)
      const errorMessage = getCameraErrorMessage(err)
      setError(errorMessage)
      onError(errorMessage)
      setIsLoading(false)
      setIsScanning(false)
    }
  }

  const getCameraErrorMessage = (error: any): string => {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return 'Camera permission denied. Please allow camera access in your browser settings and refresh the page.'
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'No camera found on this device.'
    } else if (error.name === 'NotSupportedError' || error.name === 'ConstraintNotSatisfiedError') {
      return 'Camera not supported or constraints not satisfied.'
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Camera is already in use by another application.'
    } else if (error.name === 'OverconstrainedError') {
      return 'Camera constraints not supported. Please try a different camera or device.'
    } else if (error.name === 'TypeError') {
      return 'Invalid camera constraints or no camera available.'
    } else {
      return error.message || 'Failed to access camera'
    }
  }

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && isScanning) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          try {
            canvas.height = video.videoHeight
            canvas.width = video.videoWidth
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
           
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsqr(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            })

            if (code) {
              console.log('QR Code detected:', code.data)
              onScan(code.data)
              if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current)
              }
              setIsScanning(false)
            }
          } catch (err) {
            console.error('QR scanning error:', err)
          }
        }
      }
    }, 300)
  }

  const handleManualScan = () => {
    const testData = 'EMP001'
    console.log('Manual QR scan triggered:', testData)
    onScan(testData)
  }

  const retryCamera = async () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }
   
    await startCamera()
  }

  const switchCamera = async (deviceId: string) => {
    setSelectedCamera(deviceId)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }
    setIsScanning(false)
    await startCamera()
  }

  useEffect(() => {
    checkCameraPermissions()
  }, [])

  useEffect(() => {
    if (selectedCamera && permissionStatus === 'granted') {
      startCamera()
    } else if (permissionStatus === 'denied') {
      setError('Camera permission denied. Please allow access in your browser settings and refresh the page.')
      setIsLoading(false)
    }
  }, [selectedCamera, permissionStatus])

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
     
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-white text-center">
            <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Starting camera...</p>
            {permissionStatus === 'prompt' && (
              <p className="text-xs text-gray-300 mt-2">Please allow camera access when prompted</p>
            )}
          </div>
        </div>
      )}
     
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-white text-center p-4 max-w-md">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <Alert className="mb-4 border-red-500 bg-red-900/20">
              <AlertDescription className="text-white text-sm">
                {error}
              </AlertDescription>
            </Alert>
           
            <div className="space-y-2">
              <Button onClick={retryCamera} variant="outline" className="text-white border-white hover:bg-white hover:text-black w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Camera
              </Button>
             
              {cameraDevices.length > 1 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-300">Try another camera:</p>
                  {cameraDevices.map((device) => (
                    <Button
                      key={device.deviceId}
                      onClick={() => switchCamera(device.deviceId)}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-black w-full text-xs"
                      size="sm"
                    >
                      {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
                    </Button>
                  ))}
                </div>
              )}
             
              <Button
                onClick={handleManualScan}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Simulate QR Scan
              </Button>
            </div>
          </div>
        </div>
      )}
     
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
     
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-4 border-green-400 border-dashed rounded-lg m-8 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-400 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-green-300 rounded-lg animate-pulse"></div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isScanning ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {isScanning ? 'Scanning...' : 'Camera Off'}
        </div>
      </div>

      {cameraDevices.length > 1 && !error && !isLoading && (
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {cameraDevices.find(d => d.deviceId === selectedCamera)?.label || 'Camera 1'}
          </div>
        </div>
      )}

      {/* Camera Switcher Dropdown */}
      {cameraDevices.length > 1 && !error && !isLoading && (
        <div className="absolute bottom-4 right-4 z-20">
          <select
            value={selectedCamera}
            onChange={(e) => switchCamera(e.target.value)}
            className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded appearance-none cursor-pointer"
          >
            {cameraDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
