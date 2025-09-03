'use client'

import { useState } from 'react'
import { Camera, QrCode, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QRScanner from '@/components/QRScanner'

export default function QRTestPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(true)

  const handleScan = (data: string) => {
    console.log('QR Code scanned successfully:', data)
    setScanResult(data)
    setError(null)
    setCameraActive(false)
  }

  const handleError = (errorMessage: string) => {
    console.error('Scanner error:', errorMessage)
    setError(errorMessage)
    setScanResult(null)
  }

  const resetScanner = () => {
    setScanResult(null)
    setError(null)
    setCameraActive(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              QR Scanner Test Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This page tests the QR scanner functionality. Try scanning a QR code or use the simulate button to test the functionality.
            </p>
            
            {error && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {scanResult && (
              <Alert className="mb-4 border-green-500 bg-green-50">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  <strong>QR Code Detected!</strong><br />
                  Data: {scanResult}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Camera Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {cameraActive ? (
                  <QRScanner 
                    onScan={handleScan}
                    onError={handleError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                      <p>Scan Complete</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <Button 
                  onClick={resetScanner}
                  className="w-full"
                  variant="outline"
                >
                  Reset Scanner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Information */}
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Camera Status:</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>{cameraActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Last Scan Result:</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  {scanResult || 'No scan yet'}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Test QR Codes:</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>Employee ID:</strong> EMP001
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>URL Format:</strong> https://primesteel.com/verify?employee=EMP001
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Troubleshooting:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Ensure camera permissions are granted</li>
                  <li>• Try different cameras if available</li>
                  <li>• Ensure good lighting conditions</li>
                  <li>• Hold QR code steady and centered</li>
                  <li>• Use simulate button if camera fails</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}