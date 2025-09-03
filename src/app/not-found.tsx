'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Page Not Found</CardTitle>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}