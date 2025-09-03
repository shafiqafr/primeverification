'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Home, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Something went wrong!</CardTitle>
              <p className="text-gray-600 mt-2">
                We're sorry, but an unexpected error occurred.
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => reset()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
                <Button 
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>If this problem persists, please contact support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}